import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database Connected'))
    await mongoose.connect(process.env.MONGO_URI)
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  } 
};

// ✅ Correct (ES Module)
export default connectDB;


/* Notes - In config folder, create configuration files like
MongoDB Configuration, Cloudinary Configuration
*/