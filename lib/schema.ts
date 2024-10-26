import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';

export const emailJobs = pgTable('email_jobs', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  status: varchar('status', { length: 50 }),
  sentAt: timestamp('sent_at'),
  error: text('error'),
  ip: varchar('ip', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow(),
  recipientCount: integer('recipient_count')
});
