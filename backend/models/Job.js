import mongoose from 'mongoose';

const salaryRangeSchema = new mongoose.Schema(
  {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' }, // stored as HTML from the rich-text editor
    skills: { type: [String], default: [] },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    location: { type: String, enum: ['remote', 'hybrid', 'on-site'], default: 'remote' },
    workLocation: {
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
    },
    salaryRange: { type: salaryRangeSchema, default: () => ({ min: null, max: null }) },
    ctc: { type: Number, default: null },
    jobTypes: { type: [String], default: [] },

    postedBy: { type: String, default: 'Owner' }, // role snapshot, mirrors Property.postedBy
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);