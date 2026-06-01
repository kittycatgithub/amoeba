import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, unique: true, sparse: true, trim: true },
    role: {
      type: String,
      enum: ['User', 'Owner', 'Company', 'Agent', 'Dealer', 'Builder'],
      default: 'User',
    },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* Hash password before saving
    userSchema.pre('save', async function (next) {
      // if (!this.isModified('password')) return next();
      if (!this.isModified('password')) return;
      this.password = await bcrypt.hash(this.password, 12);
      // next();
    });
*/

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema )

export default User