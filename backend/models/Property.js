import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true }, // Buy, Rent, Commercial, Plots & Land, New Launch
    price: { type: String, required: true },     // display string "45 Lac"
    priceValue: { type: Number, required: true }, // numeric for filtering
    area: { type: String, required: true },       // display string "1200 Sq.Ft"
    areaValue: { type: Number, required: true },  // numeric for filtering
    type: { type: String, required: true },       // Residential Apartment, etc.
    status: { type: String, default: 'Available' },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    furnishing: { type: String, default: '' },
    postedBy: { type: String, default: 'Owner' }, // role label for filtering
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
    availableFor: [{ type: String }],
    amenities: [{ type: String }],
    images: [{ type: String }],       // relative paths or URLs
    location: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, default: '' },
    availability: { type: String, default: 'Ready to Move' },
  },
  { timestamps: true }
);

// Text index for search
propertySchema.index({ title: 'text', location: 'text', city: 'text' });

export default mongoose.model('Property', propertySchema);