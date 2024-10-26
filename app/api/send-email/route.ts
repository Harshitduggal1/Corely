import { NextResponse } from 'next/server';
import emailQueue, { createStyledHtmlEmail } from '@/lib/emailQueue';
import { db } from '@/utils/db/dbConfig';
import { emailJobs } from '@/utils/db/schema';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function validateEmails(emails: string[]): Promise<string[]> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.filter(email => emailRegex.test(email.trim()));
}

async function generateEmailContent(prompt: string, websiteUrl: string, retries = 3): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🤖 Generating content (attempt ${attempt}/${retries})...`);
      
      const safePrompt = `Create a highly personalized, attention-grabbing email based on the following instructions:
${prompt}

Critical requirements:
1. Use {{firstName}} as a placeholder for the recipient's first name in the greeting.
2. Create engaging and attention-grabbing content.
3. Structure the content with clear sections: introduction, main points, and conclusion.
4. Include a prominent call-to-action that encourages visiting ${websiteUrl}.
5. Keep the tone professional yet friendly.
6. Ensure the content is concise but impactful.
7. Do not include any HTML formatting or styling.

Important: Provide only the text content of the email. Do not include any HTML tags or styling instructions.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: safePrompt }]}],
      });

      const response = await result.response;
      const content = response.text();

      if (!content || content.length < 100) {
        throw new Error('Generated content too short or empty');
      }

      // Verify that {{firstName}} and websiteUrl are included in the content
      if (!content.includes('{{firstName}}') || !content.includes(websiteUrl)) {
        throw new Error('Generated content missing required elements');
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
  
  try {
    const { recipients, subject, prompt, websiteUrl } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('No valid recipients provided');
    }
    if (!subject?.trim()) throw new Error('Subject is required');
    if (!prompt?.trim()) throw new Error('Prompt is required for generating email content');
    if (!websiteUrl?.trim()) throw new Error('Website URL is required');

    const validRecipients = await validateEmails(recipients);
    if (validRecipients.length === 0) {
      throw new Error('No valid email addresses provided');
    }

    console.log(`📧 Processing request for ${validRecipients.length} recipients`);

    const emailContent = await generateEmailContent(prompt, websiteUrl);
    console.log('📝 Email content generated successfully');

    // Apply styling to the generated content
    const styledHtmlContent = createStyledHtmlEmail(emailContent, websiteUrl);

    const recipientsWithNames = validRecipients.map(email => ({
      email,
      firstName: email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1)
    }));

    const job = await emailQueue.add({
      recipients: recipientsWithNames,
      subject: subject.trim(),
      htmlContent: styledHtmlContent,
      textContent: emailContent,  // Make sure this is being passed
      ip,
      websiteUrl
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: true,
      removeOnFail: false
    });

    await db.insert(emailJobs).values({
      status: 'queued',
      ip,
      createdAt: new Date(),
      recipientCount: validRecipients.length
    });

    console.log(`✅ Email job ${job.id} queued successfully`);
    
    // Generate a preview with the first recipient's name
    const firstRecipient = recipientsWithNames[0];
    const previewContent = styledHtmlContent.replace(/{{firstName}}/g, firstRecipient.firstName);

    return NextResponse.json({ 
      success: true,
      message: 'Email job queued successfully',
      jobId: job.id,
      recipientCount: validRecipients.length,
      previewContent
    });

  } catch (error) {
    console.error('❌ Error in email processing:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process email request' 
    }, { 
      status: 500 
    });
  }
}
