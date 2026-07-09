import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const smtpHost = String(process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com').trim();
const smtpPort = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 465);
const smtpSecure = String(process.env.EMAIL_SECURE || process.env.SMTP_SECURE || 'true').toLowerCase() === 'true';
const smtpUser = String(process.env.EMAIL_USER || process.env.SMTP_USER || '').trim();
const smtpPass = String(process.env.EMAIL_PASS || process.env.SMTP_PASS || '').replace(/\s+/g, '');
const adminEmail = String(process.env.ADMIN_EMAIL || process.env.MAIL_TO || 'shahidbhati8233@gmail.com').trim();

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    return { success: true };
  } catch (error) {
    console.error('SMTP verification failed:', error);
    return { success: false, error };
  }
}

export async function sendEmail({ to, subject, text, html, attachments = [] }) {
  if (!to) {
    throw new Error('Recipient email address is required.');
  }

  const mailOptions = {
    from: `Red Rose School <${smtpUser || adminEmail}>`,
    to,
    subject,
    text,
    html,
    attachments
  };

  return transporter.sendMail(mailOptions);
}

export { adminEmail };
