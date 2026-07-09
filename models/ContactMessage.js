import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  ipAddress: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
