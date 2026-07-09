import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true, trim: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String },
  loginMethod: { type: String, enum: ['email', 'google'], default: 'email' },
  source: { type: String, default: 'website' },
  ipAddress: { type: String, trim: true },
  browser: { type: String, trim: true },
  operatingSystem: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
