import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  fatherName: { type: String, trim: true },
  motherName: { type: String, trim: true },
  classApplyingFor: { type: String, trim: true },
  gender: { type: String, trim: true },
  dob: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  address: { type: String, trim: true },
  previousSchool: { type: String, trim: true },
  message: { type: String, trim: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Admission', admissionSchema);
