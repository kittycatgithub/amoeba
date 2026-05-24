/**
 * Seed script — populates the database with sample properties and a demo user.
 * Run: node seed.js
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import connectDB from './config/db.js';

const sampleProperties = [
  { title: "Elan The Emperor - 3 BHK", category: "Buy", price: "1.2 Cr", priceValue: 120, area: "1800 Sq.Ft", areaValue: 1800, type: "Residential Apartment", bedrooms: 3, bathrooms: 2, furnishing: "Semi-Furnished", availableFor: ["Family"], amenities: ["Parking","Lift","Power Backup","Swimming Pool","Gymnasium","Park / Garden","CCTV Security","Club House"], location: "Sector 106, Gurugram", city: "Gurugram", description: "A premium 3 BHK apartment in a gated community with world-class amenities.", availability: "Ready to Move" },
  { title: "2 BHK Flat in Andheri West", category: "Buy", price: "95 Lac", priceValue: 95, area: "1050 Sq.Ft", areaValue: 1050, type: "Residential Apartment", bedrooms: 2, bathrooms: 2, furnishing: "Furnished", availableFor: ["Family","Single Men","Single Women"], amenities: ["Parking","Lift","Power Backup","CCTV Security","Intercom"], location: "Andheri West, Mumbai", city: "Mumbai", description: "Well-maintained furnished flat near metro station.", availability: "Ready to Move" },
  { title: "Luxury Villa in Whitefield", category: "Buy", price: "2.5 Cr", priceValue: 250, area: "3500 Sq.Ft", areaValue: 3500, type: "Independent House/Villa", bedrooms: 4, bathrooms: 4, furnishing: "Furnished", availableFor: ["Family"], amenities: ["Parking","Swimming Pool","Gymnasium","Park / Garden","WiFi / Internet","AC","CCTV Security","Club House","Gated Community"], location: "Whitefield, Bengaluru", city: "Bengaluru", description: "Exquisite luxury villa with private garden and pool access.", availability: "Ready to Move" },
  { title: "1 BHK Studio in Koramangala", category: "Rent", price: "25K/mo", priceValue: 25, area: "550 Sq.Ft", areaValue: 550, type: "1 RK / Studio Apartment", bedrooms: 1, bathrooms: 1, furnishing: "Furnished", availableFor: ["Single Men","Single Women"], amenities: ["Parking","Lift","WiFi / Internet","AC"], location: "Koramangala, Bengaluru", city: "Bengaluru", description: "Compact studio apartment ideal for working professionals.", availability: "Ready to Move" },
  { title: "3 BHK in Noida Extension", category: "Buy", price: "72 Lac", priceValue: 72, area: "1450 Sq.Ft", areaValue: 1450, type: "Builder Floor", bedrooms: 3, bathrooms: 2, furnishing: "Unfurnished", availableFor: ["Family"], amenities: ["Parking","Power Backup","Park / Garden","Fire Safety"], location: "Sector 16, Noida", city: "Noida", description: "Spacious builder floor in a prime Noida extension locality.", availability: "Within 6 Months" },
  { title: "Commercial Office in BKC", category: "Commercial", price: "3.8 Cr", priceValue: 380, area: "2200 Sq.Ft", areaValue: 2200, type: "Commercial Office", bedrooms: 0, bathrooms: 2, furnishing: "Furnished", availableFor: ["Company Lease"], amenities: ["Parking","Lift","Power Backup","AC","CCTV Security","Fire Safety"], location: "BKC, Mumbai", city: "Mumbai", description: "Premium commercial office space in the heart of BKC.", availability: "Ready to Move" },
  { title: "Residential Plot in Jaipur", category: "Plots & Land", price: "35 Lac", priceValue: 35, area: "2400 Sq.Ft", areaValue: 2400, type: "Residential Land", bedrooms: 0, bathrooms: 0, furnishing: "", availableFor: [], amenities: [], location: "Mansarovar, Jaipur", city: "Jaipur", description: "East-facing residential plot in a well-developed area.", availability: "Ready to Move" },
  { title: "2 BHK Flat for Rent in HSR Layout", category: "Rent", price: "30K/mo", priceValue: 30, area: "1100 Sq.Ft", areaValue: 1100, type: "Residential Apartment", bedrooms: 2, bathrooms: 2, furnishing: "Semi-Furnished", availableFor: ["Family","Single Men"], amenities: ["Parking","Lift","Gymnasium","CCTV Security","Intercom"], location: "HSR Layout, Bengaluru", city: "Bengaluru", description: "Well-maintained 2 BHK with balcony facing the park.", availability: "Ready to Move" },
  { title: "4 BHK Penthouse in Powai", category: "Buy", price: "4.2 Cr", priceValue: 420, area: "4000 Sq.Ft", areaValue: 4000, type: "Residential Apartment", bedrooms: 4, bathrooms: 3, furnishing: "Furnished", availableFor: ["Family"], amenities: ["Parking","Lift","Power Backup","Swimming Pool","Gymnasium","Park / Garden","WiFi / Internet","AC","CCTV Security","Club House","Rainwater Harvesting","Gated Community"], location: "Powai, Mumbai", city: "Mumbai", description: "Stunning penthouse with panoramic lake views.", availability: "Ready to Move" },
  { title: "Shop for Sale in Connaught Place", category: "Commercial", price: "5 Cr", priceValue: 500, area: "800 Sq.Ft", areaValue: 800, type: "Commercial Shop", bedrooms: 0, bathrooms: 1, furnishing: "Unfurnished", availableFor: ["Company Lease"], amenities: ["Parking","Power Backup","CCTV Security","Fire Safety"], location: "Connaught Place, Delhi", city: "Delhi", description: "Prime retail shop in the busiest market of Delhi.", availability: "Ready to Move" },
  { title: "3 BHK in Wakad, Pune", category: "Buy", price: "85 Lac", priceValue: 85, area: "1350 Sq.Ft", areaValue: 1350, type: "Residential Apartment", bedrooms: 3, bathrooms: 2, furnishing: "Semi-Furnished", availableFor: ["Family","Single Men"], amenities: ["Parking","Lift","Power Backup","Swimming Pool","Gymnasium","Club House","Gated Community"], location: "Wakad, Pune", city: "Pune", description: "Modern 3 BHK in a new township with good connectivity.", availability: "Within 6 Months" },
  { title: "New Launch Tower in Dwarka", category: "New Launch", price: "1.1 Cr", priceValue: 110, area: "1600 Sq.Ft", areaValue: 1600, type: "Residential Apartment", bedrooms: 3, bathrooms: 2, furnishing: "Unfurnished", availableFor: ["Family"], amenities: ["Parking","Lift","Power Backup","Swimming Pool","Gymnasium","Park / Garden","Club House","Rainwater Harvesting","Gated Community"], location: "Dwarka, Delhi", city: "Delhi", description: "Brand new launch with modern architecture and green surroundings.", availability: "More Than 1 Year" },
];

const ROLES = ['Owner', 'Builder', 'Dealer', 'Agent', 'Company'];

async function seed() {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Property.deleteMany({});
  console.log('Cleared existing data');

  // Create demo user
  const demoUser = await User.create({
    name: 'Demo User',
    email: 'user@demo.com',
    password: 'demo123',
    phone: '9876543210',
    role: 'Owner',
    isVerified: true,
  });

  // Create admin user
  const adminUser = await User.create({
    name: 'Admin',
    email: 'admin@demo.com',
    password: 'admin123',
    phone: '9876543211',
    role: 'Builder',
    isVerified: true,
  });

  console.log('Created demo users');

  // Create properties
  const owners = [demoUser, adminUser];
  for (let i = 0; i < sampleProperties.length; i++) {
    const owner = owners[i % owners.length];
    await Property.create({
      ...sampleProperties[i],
      owner: owner._id,
      postedBy: ROLES[i % ROLES.length],
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    });
  }

  console.log(`Seeded ${sampleProperties.length} properties`);
  console.log('\nDemo credentials:');
  console.log('  user@demo.com / demo123 (Owner)');
  console.log('  admin@demo.com / admin123 (Builder)');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
