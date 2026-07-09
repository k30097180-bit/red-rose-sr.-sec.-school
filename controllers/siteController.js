import User from '../models/User.js';
import Admission from '../models/Admission.js';
import JobApplication from '../models/JobApplication.js';
import ContactMessage from '../models/ContactMessage.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import Notification from '../models/Notification.js';
import { sendEmail, adminEmail } from '../config/email.js';
import { renderRegistrationEmail, renderAdmissionEmail, renderAdminAdmissionEmail, renderJobApplicationEmail, renderContactEmail, renderNewsletterEmail } from '../utils/emailTemplates.js';
import { sanitizeInput } from '../utils/sanitize.js';

function getRequestContext(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  const ipAddress = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || req.socket.remoteAddress || 'Unknown';
  const browser = req.headers['user-agent'] || 'Unknown';
  const operatingSystem = req.headers['sec-ch-ua-platform'] || 'Unknown';

  return { ipAddress, browser, operatingSystem };
}

async function sendMailSafely({ to, subject, text, html, attachments = [] }) {
  try {
    await sendEmail({ to, subject, text, html, attachments });
    return { success: true };
  } catch (error) {
    console.error(`Email delivery failed [${subject}] to ${to}:`, error);
    return { success: false, error };
  }
}

async function createNotification(title, message, type) {
  try {
    await Notification.create({ title, message, type });
  } catch (error) {
    console.error('Notification persistence failed:', error);
  }
}

export async function registerStudent(req, res) {
  try {
    const payload = sanitizeInput(req.body);
    const { name, email, phone, password, loginMethod = 'email' } = payload;
    const normalizedName = name || (email ? email.split('@')[0] : 'Student');
    const requestContext = getRequestContext(req);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    const user = await User.create({
      name: normalizedName,
      email,
      phone,
      passwordHash: password || null,
      loginMethod,
      ipAddress: requestContext.ipAddress,
      browser: requestContext.browser,
      operatingSystem: requestContext.operatingSystem
    });

    const registrationTime = new Date().toLocaleString();
    await createNotification('New User Registration', `${normalizedName} registered as a new student.`, 'registration');

    await sendMailSafely({
      to: adminEmail,
      subject: 'New User Registration',
      html: renderRegistrationEmail({
        name: normalizedName,
        email,
        phone,
        registrationTime,
        loginMethod,
        ipAddress: requestContext.ipAddress,
        browser: requestContext.browser,
        operatingSystem: requestContext.operatingSystem
      }),
      text: `A new student has registered.\nName: ${normalizedName}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nLogin Method: ${loginMethod}\nIP Address: ${requestContext.ipAddress}\nBrowser: ${requestContext.browser}\nOS: ${requestContext.operatingSystem}`
    });

    return res.status(201).json({ success: true, message: 'Student registered successfully.', user });
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({ success: false, message: 'Registration failed.' });
  }
}

export async function submitAdmission(req, res) {
  try {
    const payload = sanitizeInput(req.body);
    const studentPayload = {
      ...payload,
      classApplyingFor: payload.classApplyingFor || payload.studentClass || payload.class || '',
      message: payload.message || payload.description || ''
    };
    const student = await Admission.create(studentPayload);

    const studentEmailHtml = renderAdmissionEmail({ student });
    const adminEmailHtml = renderAdminAdmissionEmail({ student });

    await sendMailSafely({
      to: student.email,
      subject: 'Admission Request Received',
      html: studentEmailHtml,
      text: 'Your admission request has been received.'
    });

    await sendMailSafely({
      to: adminEmail,
      subject: 'New Admission Request',
      html: adminEmailHtml,
      text: 'New admission request received.'
    });

    await createNotification('New Admission Request', `${student.studentName} submitted an admission request.`, 'admission');

    return res.status(201).json({ success: true, message: 'Application Submitted Successfully.' });
  } catch (error) {
    console.error('Admission submission failed:', error);
    return res.status(500).json({ success: false, message: 'Admission submission failed.' });
  }
}

export async function submitJobApplication(req, res) {
  try {
    const payload = sanitizeInput(req.body);
    const file = req.file;
    const requestContext = getRequestContext(req);

    const application = await JobApplication.create({
      ...payload,
      resumePath: file ? `/uploads/resumes/${file.filename}` : null,
      ipAddress: requestContext.ipAddress,
      browser: requestContext.browser,
      operatingSystem: requestContext.operatingSystem
    });

    const adminEmailHtml = renderJobApplicationEmail({ application });

    await sendMailSafely({
      to: adminEmail,
      subject: 'New Teacher Application',
      html: adminEmailHtml,
      text: 'A new teacher job application has been received.',
      attachments: file ? [{ filename: file.originalname, path: file.path }] : []
    });

    await createNotification('New Teacher Job Application', `${application.fullName} submitted a teacher job application.`, 'job');

    return res.status(201).json({ success: true, message: 'Application Submitted Successfully.' });
  } catch (error) {
    console.error('Job application submission failed:', error);
    return res.status(500).json({ success: false, message: 'Job application submission failed.' });
  }
}

export async function submitContact(req, res) {
  try {
    const payload = sanitizeInput(req.body);
    const requestContext = getRequestContext(req);
    const contact = await ContactMessage.create({
      ...payload,
      ipAddress: requestContext.ipAddress
    });

    await sendMailSafely({
      to: adminEmail,
      subject: 'Website Contact Form',
      html: renderContactEmail({ contact }),
      text: `Contact form message from ${contact.name}`
    });

    await createNotification('New Contact Message', `${contact.name} sent a new contact message.`, 'contact');

    return res.status(201).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact submission failed:', error);
    return res.status(500).json({ success: false, message: 'Contact submission failed.' });
  }
}

export async function subscribeNewsletter(req, res) {
  try {
    const { email } = sanitizeInput(req.body);
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Already subscribed.' });
    }

    await NewsletterSubscriber.create({ email });

    await sendMailSafely({
      to: adminEmail,
      subject: 'New Newsletter Subscriber',
      html: renderNewsletterEmail({ email }),
      text: `New newsletter subscriber: ${email}`
    });

    await createNotification('New Newsletter Subscriber', `${email} subscribed to the newsletter.`, 'newsletter');

    return res.status(201).json({ success: true, message: 'Subscribed successfully.' });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return res.status(500).json({ success: false, message: 'Subscription failed.' });
  }
}

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return res.json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Could not load notifications.' });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    return res.json({ success: true, notification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Could not update notification.' });
  }
}
