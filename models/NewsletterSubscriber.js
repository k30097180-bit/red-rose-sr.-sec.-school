import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, unique: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
