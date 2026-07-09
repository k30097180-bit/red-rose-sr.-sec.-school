import express from 'express';
import { submitAdmission } from '../controllers/siteController.js';

const router = express.Router();

router.post('/', submitAdmission);

export default router;
