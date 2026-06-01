import Property from '../models/Property.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Create Property ────────────────────────────────────────
export const createProperty = async (req, res) => {
  try {
    const {
      title, category, price, priceValue, area, areaValue,
      type, bedrooms, bathrooms, furnishing, availableFor,
      amenities, location, city, description, availability,
      images,   // array of Cloudinary URLs sent by client
    } = req.body;

    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const property = await Property.create({
      title,
      category,
      price,
      priceValue: Number(priceValue),
      area,
      areaValue: Number(areaValue),
      type,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      furnishing: furnishing || '',
      postedBy: req.user.role,
      updatedBy: req.user._id,  // same as owner on first create
      owner: req.user._id,
      availableFor: availableFor ? JSON.parse(availableFor) : [],
      amenities: amenities ? JSON.parse(amenities) : [],
      images,
      location,
      city,
      description: description || '',
      availability: availability || 'Ready to Move',
    });

    res.status(201).json({ message: 'Property created', property });
  } catch (err) {
    console.error('createProperty error:', err);
    res.status(500).json({ message: 'Failed to create property' });
  }
};

// ─── Get All Properties (with filters + pagination) ─────────
export const getProperties = async (req, res) => {
  try {
    const {
      page = 1, limit = 50, category, city, search,
      minBudget, maxBudget, minArea, maxArea,
      bedrooms, propertyTypes, furnishing, postedBy,
      bathrooms, amenities, availableFor, availability,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (city) filter.city = { $regex: new RegExp(`^${city}$`, 'i') };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }
    if (minBudget) filter.priceValue = { ...filter.priceValue, $gte: Number(minBudget) };
    if (maxBudget) filter.priceValue = { ...filter.priceValue, $lte: Number(maxBudget) };
    if (minArea) filter.areaValue = { ...filter.areaValue, $gte: Number(minArea) };
    if (maxArea) filter.areaValue = { ...filter.areaValue, $lte: Number(maxArea) };

    if (bedrooms) {
      const arr = bedrooms.split(',').map(Number);
      filter.bedrooms = { $in: arr };
    }
    if (propertyTypes) {
      filter.type = { $in: propertyTypes.split(',') };
    }
    if (furnishing) {
      filter.furnishing = { $in: furnishing.split(',') };
    }
    if (postedBy) {
      filter.postedBy = { $in: postedBy.split(',') };
    }
    if (bathrooms) {
      filter.bathrooms = { $in: bathrooms.split(',').map(Number) };
    }
    if (amenities) {
      filter.amenities = { $all: amenities.split(',') };
    }
    if (availableFor) {
      filter.availableFor = { $in: availableFor.split(',') };
    }
    if (availability) {
      filter.availability = { $in: availability.split(',') };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('owner', 'name email phone role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('getProperties error:', err);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

// ─── Get Single Property ────────────────────────────────────
export const getProperty = async (req, res) => {
  try {
    // const property = await Property.findById(req.params.id).populate('owner', 'name email phone role');
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone avatar role');

    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ property });
  } catch (err) {
    console.error('getProperty error:', err);
    res.status(500).json({ message: 'Failed to fetch property' });
  }
};

// ─── Get My Properties ──────────────────────────────────────
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ properties });
  } catch (err) {
    console.error('getMyProperties error:', err);
    res.status(500).json({ message: 'Failed to fetch your properties' });
  }
};

// ─── Update Property ────────────────────────────────────────
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const {
      title, category, price, priceValue, area, areaValue,
      type, status, bedrooms, bathrooms, furnishing, availableFor,
      amenities, location, city, description, availability,
      existingImages, imagesToRemove,
    } = req.body;

    if (title !== undefined) property.title = title;
    if (category !== undefined) property.category = category;
    if (price !== undefined) property.price = price;
    if (priceValue !== undefined) property.priceValue = Number(priceValue);
    if (area !== undefined) property.area = area;
    if (areaValue !== undefined) property.areaValue = Number(areaValue);
    if (type !== undefined) property.type = type;
    if (status !== undefined) property.status = status;
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
    if (furnishing !== undefined) property.furnishing = furnishing;
    if (availableFor !== undefined) property.availableFor = JSON.parse(availableFor);
    if (amenities !== undefined) property.amenities = JSON.parse(amenities);
    if (location !== undefined) property.location = location;
    if (city !== undefined) property.city = city;
    if (description !== undefined) property.description = description;
    if (availability !== undefined) property.availability = availability;

    // Handle image management
    let updatedImages = property.images;

    // Remove images that user marked for deletion
    if (imagesToRemove) {
      const toRemove = JSON.parse(imagesToRemove);
      updatedImages = updatedImages.filter(img => !toRemove.includes(img));
      
      // Delete associated image files from server
      toRemove.forEach(img => {
        const filePath = path.join(__dirname, '..', img);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Failed to delete image file:', err);
          }
        }
      });
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    property.images = updatedImages;
    property.updatedBy = req.user._id;
    await property.save();
    res.json({ message: 'Property updated', property });
  } catch (err) {
    console.error('updateProperty error:', err);
    res.status(500).json({ message: 'Failed to update property' });
  }
};

// ─── Delete Property ────────────────────────────────────────
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    // Delete associated image files
    property.images.forEach(img => {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('deleteProperty error:', err);
    res.status(500).json({ message: 'Failed to delete property' });
  }
};
