import Bull from 'bull';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { db } from '@/utils/db/dbConfig';
import { emailJobs } from '@/utils/db/schema';
import Redis from 'ioredis';
import { promisify } from 'util';
import dns from 'dns';
import pLimit from 'p-limit';

const resolveMx = promisify(dns.resolveMx);

class RobustRedisClient {
  private client: Redis;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isReconnecting = false;

  constructor(redisUrl: string) {
    this.client = this.createClient(redisUrl);
  }

  private createClient(redisUrl: string): Redis {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 10) {
          return null; // Stop retrying after 10 attempts
        }
        return Math.min(times * 100, 3000);
      },
    });

    client.on('error', this.handleError.bind(this));
    client.on('connect', () => console.log('Connected to Redis'));
    client.on('ready', () => console.log('Redis client ready'));
    client.on('close', () => console.log('Redis connection closed'));

    return client;
  }

  private handleError(error: Error) {
    console.error('Redis error:', error);
    if (!this.isReconnecting) {
      this.isReconnecting = true;
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect to Redis...');
      this.client.disconnect();
      this.client = this.createClient(process.env.REDIS_URL!);
      this.isReconnecting = false;
    }, 5000);
  }

  getClient(): Redis {
    return this.client;
  }
}

const robustRedisClient = new RobustRedisClient(process.env.REDIS_URL!);

const emailQueue = new Bull('emailQueue', {
  createClient: (type) => {
    switch (type) {
      case 'client':
        return robustRedisClient.getClient();
      case 'subscriber':
        return robustRedisClient.getClient().duplicate();
      default:
        return robustRedisClient.getClient().duplicate();
    }
  },
  limiter: {
    max: 100,  // Increased from 3 to 100
    duration: 1000
  },
  defaultJobOptions: {
    attempts: 7,
    backoff: {
      type: 'exponential',
      delay: 10000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

let transporter: nodemailer.Transporter;

async function initializeTransporter(retries = 5): Promise<void> {
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: true
      },
      pool: true,
      maxConnections: 100,  // Increased from 5 to 100
      maxMessages: Infinity
    });

    await transporter.verify();
    console.log('✅ Email transporter verified and ready');
  } catch (error) {
    console.error('❌ Transporter initialization failed:', error);
    if (retries > 0) {
      console.log(`Retrying transporter initialization in 10 seconds... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      await initializeTransporter(retries - 1);
    } else {
      throw new Error('Failed to initialize email transporter after multiple attempts');
    }
  }
}

// Initialize transporter immediately
initializeTransporter().catch(error => {
  console.error('Critical error initializing transporter:', error);
  process.exit(1);
});

async function isValidEmail(email: string): Promise<boolean> {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return false;

  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch (error) {
    console.error(`Error validating email ${email}:`, error);
    return false;
  }
}
//enhance styling for custom emails 
function createStyledHtmlEmail(textContent: string | undefined, websiteUrl: string): string {
  // Provide a default message if textContent is undefined
  const content = textContent || 'Email content not available.';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email from Corely.io</title>
    </head>
    <body style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f0f4f8; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #ff80b5, #9089fc, #3b82f6); padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Hello, {{firstName}}!</h1>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff;">
          ${content.split('\n').map(paragraph => {
            if (paragraph.includes('Corely AI Blog Platform:')) {
              return `
                <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 12px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);">
                  <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 15px 0; color: #0369a1; letter-spacing: 0.5px; border-bottom: 2px solid #0369a1; padding-bottom: 8px;">
                    Corely AI Blog Platform
                  </h2>
                  <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #1e40af; font-weight: 500;">
                    ${paragraph.split(':')[1].trim()}
                  </p>
                </div>`;
            } else if (paragraph.includes('AI Video Generation, Remastered:')) {
              return `
                <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-radius: 12px; box-shadow: 0 4px 15px rgba(219, 39, 119, 0.1);">
                  <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 15px 0; color: #9d174d; letter-spacing: 0.5px; border-bottom: 2px solid #9d174d; padding-bottom: 8px;">
                    AI Video Generation, Remastered
                  </h2>
                  <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #831843; font-weight: 500;">
                    ${paragraph.split(':')[1].trim()}
                  </p>
                </div>`;
            } else if (paragraph.includes('New Corely AI Agent:')) {
              return `
                <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.1);">
                  <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 15px 0; color: #166534; letter-spacing: 0.5px; border-bottom: 2px solid #166534; padding-bottom: 8px;">
                    New Corely AI Agent
                  </h2>
                  <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #14532d; font-weight: 500;">
                    ${paragraph.split(':')[1].trim()}
                  </p>
                </div>`;
            } else if (paragraph.includes('API Key for CRMs/CMSs:')) {
              return `
                <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #fff7ed, #ffedd5); border-radius: 12px; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.1);">
                  <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 15px 0; color: #9a3412; letter-spacing: 0.5px; border-bottom: 2px solid #9a3412; padding-bottom: 8px;">
                    API Key for CRMs/CMSs
                  </h2>
                  <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #7c2d12; font-weight: 500;">
                    ${paragraph.split(':')[1].trim()}
                  </p>
                </div>`;
            } else {
              return `
                <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.8; color: #4b5563; text-align: justify; letter-spacing: 0.3px; border-left: 3px solid #e5e7eb; padding-left: 15px;">
                  ${paragraph}
                </p>`;
            }
          }).join('')}
        </div>
        <div style="text-align: center; margin: 30px 0; padding: 0 20px;">
          <a href="${websiteUrl}" style="display: inline-block; background: linear-gradient(45deg, #3b82f6, #8b5cf6); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">Experience Corely.io</a>
        </div>
        <div style="background: linear-gradient(to right, #f9fafb, #f3f4f6); padding: 30px 20px; text-align: center; font-size: 14px; color: #6b7280;">
          <p style="margin-bottom: 15px;">Visit our website: <a href="${websiteUrl}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${websiteUrl}</a></p>
          <div style="margin-top: 20px;">
            <a href="#" style="display: inline-block; margin: 0 10px; color: #4b5563; text-decoration: none; transition: color 0.3s; font-weight: 500;">Facebook</a>
            <a href="#" style="display: inline-block; margin: 0 10px; color: #4b5563; text-decoration: none; transition: color 0.3s; font-weight: 500;">Twitter</a>
            <a href="#" style="display: inline-block; margin: 0 10px; color: #4b5563; text-decoration: none; transition: color 0.3s; font-weight: 500;">LinkedIn</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

emailQueue.process(async (job) => {
  console.log(`🚀 Starting job ${job.id}`);
  const { recipients, subject, htmlContent, textContent, websiteUrl } = job.data;
  
  if (!recipients?.length) {
    throw new Error('No recipients provided');
  }

  // Use htmlContent if provided, otherwise generate it from textContent
  const emailContent = htmlContent || createStyledHtmlEmail(textContent, websiteUrl);

  const sendEmail = async (recipient: { email: string, firstName: string }, attemptNumber = 1): Promise<boolean> => {
    try {
      if (!(await isValidEmail(recipient.email))) {
        console.warn(`Invalid email address: ${recipient.email}`);
        return false;
      }

      // Personalize the content for each recipient
      const personalizedHtmlContent = emailContent.replace(/{{firstName}}/g, recipient.firstName);

      const info: SentMessageInfo = await transporter.sendMail({
        from: {
          name: process.env.EMAIL_SENDER_NAME || 'Corely.io',
          address: process.env.NODE_MAILER_EMAIL!
        },
        to: recipient.email,
        subject,
        html: personalizedHtmlContent,
        text: textContent ? textContent.replace(/{{firstName}}/g, recipient.firstName) : undefined
      });

      console.log(`✅ Email sent successfully to ${recipient.email}. Message ID: ${info.messageId}`);
      
      await db.insert(emailJobs).values({
        email: recipient.email,
        status: 'sent',
        sentAt: new Date(),
        error: '',
        ip: job.data.ip || '',
        createdAt: new Date(),
        recipientCount: 1
      });

      return true;
    } catch (error) {
      console.error(`❌ Failed to send email to ${recipient.email} (attempt ${attemptNumber}):`, error);

      await db.insert(emailJobs).values({
        email: recipient.email,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        ip: job.data.ip || '',
        createdAt: new Date(),
        recipientCount: 1
      });

      if (attemptNumber < 5) {
        const delay = Math.min(attemptNumber * 10000, 60000);
        console.log(`🔄 Retrying email to ${recipient.email} in ${delay/1000} seconds... (attempt ${attemptNumber + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return sendEmail(recipient, attemptNumber + 1);
      }

      return false;
    }
  };

  const limit = pLimit(100);  // Process 100 emails concurrently
  const emailPromises = recipients.map((recipient: { email: string, firstName: string }) => 
    limit(() => sendEmail(recipient))
  );

  const results = await Promise.all(emailPromises);

  const successCount = results.filter(result => result).length;
  const failureCount = results.length - successCount;

  console.log(`✅ Job completed. Success: ${successCount}, Failed: ${failureCount}`);
  return {
    success: true,
    totalProcessed: recipients.length,
    successCount,
    failureCount
  };
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

emailQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

emailQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

emailQueue.on('stalled', (job) => {
  console.warn(`⚠ Job ${job.id} has stalled - will be retried`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing queue and connections...');
  await emailQueue.close();
  await robustRedisClient.getClient().quit();
  process.exit(0);
});

export default emailQueue;
export { createStyledHtmlEmail };
