import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  qualification: { type: String, trim: true },
  experience: { type: String, trim: true },
  subject: { type: String, trim: true },
  expectedSalary: { type: String, trim: true },
  currentAddress: { type: String, trim: true },
  resumePath: { type: String, trim: true },
  message: { type: String, trim: true },
  ipAddress: { type: String, trim: true },
  browser: { type: String, trim: true },
  operatingSystem: { type: String, trim: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('JobApplication', jobApplicationSchema);
