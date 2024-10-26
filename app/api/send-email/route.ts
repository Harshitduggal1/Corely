import { NextResponse } from 'next/server';
import emailQueue from '@/lib/emailQueue';
import { db } from '@/utils/db/dbConfig';
import { emailJobs } from '@/utils/db/schema';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini once (don't create new instance per request)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
});

async function validateEmails(emails: string[]): Promise<string[]> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.filter(email => emailRegex.test(email.trim()));
}

async function generateEmailContent(prompt: string, retries = 3): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🤖 Generating content (attempt ${attempt}/${retries})...`);
      
      const safePrompt = `Write a professional email:
${prompt}

Important: Keep the tone professional and ensure the content is email-appropriate.`;

      const result = await model.generateContent({
        contents: [{ 
          role: "user", 
          parts: [{ text: safePrompt }]
        }],
      });

      const response = await result.response;
      const content = response.text();

      if (!content || content.length < 10) {
        throw new Error('Generated content too short or empty');
      }

      // Basic content validation
      if (content.includes("{{") || content.includes("}}")) {
        throw new Error('Generated content contains template literals');
      }

      return content;
    } catch (error) {
      console.error(`Generation attempt ${attempt} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  throw lastError || new Error('Failed to generate email content');
}

export async function POST(req: Request) {
  console.log('📨 Starting email processing...');
  const startTime = Date.now();
  
  try {
    // Rate limiting check
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const recentRequests = await db.query.emailJobs.findMany({
      where: (jobs, { and, eq, gt }) => and(
        eq(jobs.ip, ip),
        gt(jobs.createdAt, new Date(Date.now() - 3600000))
      )
    });

    if (recentRequests.length > 50) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Parse and validate request
    const body = await req.json().catch(() => ({}));
    const { recipients, subject, prompt } = body;

    if (!recipients || !Array.isArray(recipients)) {
      throw new Error('Recipients must be an array of email addresses');
    }
    if (!subject?.trim()) {
      throw new Error('Subject is required');
    }
    if (!prompt?.trim()) {
      throw new Error('Prompt is required for generating email content');
    }

    // Validate email addresses
    const validRecipients = await validateEmails(recipients);
    if (validRecipients.length === 0) {
      throw new Error('No valid email addresses provided');
    }

    console.log(`📧 Processing ${validRecipients.length} valid recipients`);

    // Generate email content with retries
    const emailContent = await generateEmailContent(prompt);
    console.log('📝 Email content generated successfully');

    // Queue the email job with optimized settings
    const job = await emailQueue.add({
      recipients: validRecipients,
      subject: subject.trim(),
      prompt, // Store original prompt for reference
      text: emailContent,
      ip,
      timestamp: new Date().toISOString()
    }, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      timeout: 300000,
      removeOnComplete: true,
      removeOnFail: false,
      priority: validRecipients.length > 100 ? 2 : 1
    });

    // Log job to database
    await db.insert(emailJobs).values({
      status: 'queued',
      ip,
      createdAt: new Date(),
      recipientCount: validRecipients.length,
      email: validRecipients.join(', '),
      error: ''
    });

    const processingTime = Date.now() - startTime;
    console.log(`✅ Job ${job.id} queued successfully (${processingTime}ms)`);
    
    return NextResponse.json({
      success: true,
      message: 'Email job queued successfully',
      jobId: job.id,
      recipientCount: validRecipients.length,
      validRecipients: validRecipients.length,
      invalidRecipients: recipients.length - validRecipients.length,
      previewContent: emailContent.substring(0, 200) + '...',
      processingTime
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('❌ Error in email processing:', error);
    
    // Log error to database
    try {
      await db.insert(emailJobs).values({
        status: 'api_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
        createdAt: new Date(),
        recipientCount: 0
      });
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process email request',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      }
    });
  }
}
