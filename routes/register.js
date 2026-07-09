import express from 'express';
import { registerStudent } from '../controllers/siteController.js';

const router = express.Router();

router.post('/', registerStudent);

export default router;
