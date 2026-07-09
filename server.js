import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './config/db.js';
import { adminEmail, sendEmail, verifyEmailConnection } from './config/email.js';
import { securityMiddleware } from './middlewares/security.js';
import admissionRoutes from './routes/admissions.js';
import registerRoutes from './routes/register.js';
import applyJobRoutes from './routes/apply-job.js';
import siteRoutes from './routes/site.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '25kb' }));
app.use(express.urlencoded({ extended: true }));
securityMiddleware.forEach((middleware) => app.use(middleware));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', siteRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/apply-job', applyJobRoutes);

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'API is healthy.' }));

app.get('/test-email', async (_req, res) => {
  try {
    await sendEmail({
      to: adminEmail,
      subject: 'Email Test Successful',
      text: 'This confirms Nodemailer is working correctly.',
      html: '<p>This confirms Nodemailer is working correctly.</p>'
    });
    return res.json({ success: true });
  } catch (error) {
    console.error('Test email failed:', error);
    return res.status(500).json({ success: false, message: 'Test email failed.', error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Something went wrong. Please try again later.' });
});

async function startServer() {
  try {
    await connectToDatabase();
    console.log('✓ Mongo Connected');

    const smtpResult = await verifyEmailConnection();
    if (smtpResult.success) {
      console.log('✓ SMTP Connected');
      console.log('✓ Email Ready');
    } else {
      console.error('SMTP verification failed. Reason:', smtpResult.error?.message || smtpResult.error || 'Unknown SMTP error');
    }

    app.listen(PORT, () => {
      console.log(`✓ Server Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
