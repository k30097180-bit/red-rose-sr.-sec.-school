import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedModel' },
  relatedModel: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
