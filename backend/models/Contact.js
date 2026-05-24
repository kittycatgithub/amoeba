import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);