import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerStudent, submitAdmission, submitJobApplication, submitContact, subscribeNewsletter, getNotifications, markNotificationAsRead } from '../controllers/siteController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads', 'resumes'),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/DOCX files are allowed.'));
    }
  }
});

router.post('/register', registerStudent);
router.post('/admissions', submitAdmission);
router.post('/teacher-application', upload.single('resume'), submitJobApplication);
router.post('/contact', submitContact);
router.post('/newsletter', subscribeNewsletter);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);

export default router;
