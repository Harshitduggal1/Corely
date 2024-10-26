import Bull from 'bull';
import nodemailer, { Transporter } from 'nodemailer';
import { db } from '@/utils/db/dbConfig';
import { emailJobs } from '@/utils/db/schema';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Create email queue with conservative settings for maximum reliability
const emailQueue = new Bull('emailQueue', process.env.REDIS_URL!, {
  limiter: {
    max: 10, // Reduced for higher reliability
    duration: 1000
  },
  defaultJobOptions: {
    attempts: 7, // Increased retry attempts
    timeout: 120000, // 2 minute timeout
    removeOnComplete: true,
    removeOnFail: false,
    backoff: {
      type: 'exponential',
      delay: 3000 // Start with 3 seconds
    }
  }
});

let transporter: Transporter;

async function initializeTransporter(retries = 5): Promise<void> {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD
      },
      pool: true,
      maxConnections: 3, // Reduced for stability
      maxMessages: 50,
      secure: true,
      tls: {
        rejectUnauthorized: true
      },
      // Added Gmail-specific settings
      rateDelta: 1000, // Minimum time between emails
      rateLimit: 10, // Max emails per rateDelta
    });

    // Verify connection with retry
    let verified = false;
    for (let i = 0; i < 3; i++) {
      try {
        verified = await transporter.verify();
        if (verified) break;
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    if (!verified) {
      throw new Error('Transporter verification failed');
    }

    console.log('✅ Email transporter verified and ready');
  } catch (error) {
    console.error('❌ Transporter initialization failed:', error);
    if (retries > 0) {
      console.log(`🔄 Retrying initialization... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await initializeTransporter(retries - 1);
    } else {
      throw new Error('Failed to initialize email transporter after multiple attempts');
    }
  }
}

// Initialize transporter with verification
initializeTransporter().catch(error => {
  console.error('Critical: Failed to initialize email transporter:', error);
  process.exit(1); // Exit if we can't initialize the transporter
});

const MAX_BATCH_SIZE = 10; // Reduced for higher reliability

// Process email queue with maximum reliability
emailQueue.process(async (job) => {
  console.log(`🚀 Starting job ${job.id}`);
  const { recipients, subject, prompt } = job.data;
  
  if (!recipients?.length) {
    throw new Error('No recipients provided');
  }

  // Validate email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validRecipients = recipients.filter((email: string) => emailRegex.test(email));
  
  if (validRecipients.length === 0) {
    throw new Error('No valid email addresses provided');
  }

  try {
    // Generate email content with retry mechanism
    let emailContent = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🤖 Generating email content (attempt ${attempt})...`);
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }]}],
        });
        emailContent = result.response.text();
        if (emailContent) break;
      } catch (e) {
        if (attempt === 3) throw e;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!emailContent) {
      throw new Error('Failed to generate email content after multiple attempts');
    }

    const sendBatch = async (batch: string[], attemptNumber = 1): Promise<boolean> => {
      try {
        if (!transporter) {
          await initializeTransporter();
        }

        // Pre-send validation
        if (!transporter || !batch.length) {
          throw new Error('Invalid sending configuration');
        }

        console.log(`📧 Sending to ${batch.length} recipients (attempt ${attemptNumber})`);
        
        const info = await transporter.sendMail({
          from: {
            name: process.env.EMAIL_SENDER_NAME || "Your Company",
            address: process.env.NODE_MAILER_EMAIL!
          },
          bcc: batch,
          subject,
          html: emailContent,
          headers: {
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
            'Importance': 'high'
          },
          // Added for reliability
          disableFileAccess: true,
          disableUrlAccess: true,
        });

        if (!info.messageId) {
          throw new Error('No messageId received from SMTP server');
        }

        console.log(`✅ Batch sent successfully. MessageID: ${info.messageId}`);

        // Log success
        await db.insert(emailJobs).values({
          email: batch.join(', '),
          status: 'sent',
          sentAt: new Date(),
          error: '',
          ip: job.data.ip || '',
          createdAt: new Date(),
          recipientCount: batch.length
        });

        return true;
      } catch (error) {
        console.error(`❌ Batch send failed (attempt ${attemptNumber}):`, error);

        // Log failure
        await db.insert(emailJobs).values({
          email: batch.join(', '),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          ip: job.data.ip || '',
          createdAt: new Date(),
          recipientCount: batch.length
        });

        // Enhanced retry logic with progressive delays
        if (attemptNumber < 5) {
          const delay = Math.min(attemptNumber * 5000, 30000);
          console.log(`🔄 Retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Reinitialize transporter on connection errors
          if (error instanceof Error && 
              (error.message.includes('ECONNRESET') || 
               error.message.includes('ETIMEDOUT'))) {
            await initializeTransporter();
          }
          
          return sendBatch(batch, attemptNumber + 1);
        }

        throw error;
      }
    };

    // Process emails with enhanced reliability
    const batches = [];
    for (let i = 0; i < validRecipients.length; i += MAX_BATCH_SIZE) {
      batches.push(validRecipients.slice(i, i + MAX_BATCH_SIZE));
    }

    console.log(`📨 Processing ${validRecipients.length} recipients in ${batches.length} batches`);

    let successCount = 0;
    for (const batch of batches) {
      await sendBatch(batch);
      successCount += batch.length;
      console.log(`✓ Progress: ${successCount}/${validRecipients.length} emails sent`);
      // Adaptive delay between batches
      const delay = Math.max(2000, Math.min(batch.length * 200, 5000));
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return {
      success: true,
      recipientCount: validRecipients.length,
      allBatchesCompleted: true
    };
  } catch (error) {
    console.error(`❌ Job ${job.id} failed:`, error);
    throw error;
  }
});

// Queue monitoring
emailQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed successfully:`, result);
});

emailQueue.on('failed', async (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
  await db.insert(emailJobs).values({
    status: 'job_failed',
    error: err.message,
    ip: job.data.ip || '',
    createdAt: new Date(),
    recipientCount: 0
  }).catch(console.error);
});

emailQueue.on('stalled', async (job) => {
  console.warn(`⚠️ Job ${job.id} has stalled - will be retried`);
  await initializeTransporter().catch(console.error);
});

emailQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

// Cleanup and health check
setInterval(async () => {
  try {
    await emailQueue.clean(86400000, 'completed'); // Clean completed jobs older than 24h
    if (!transporter) {
      await initializeTransporter();
    }
  } catch (error) {
    console.error('Maintenance error:', error);
  }
}, 3600000); // Run every hour

export default emailQueue;
