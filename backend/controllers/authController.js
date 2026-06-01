import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendEmail, generateOTP } from '../utils/sendEmail.js';
import { validationResult } from 'express-validator';

const sendTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,    //Prevent JavaScript to access cookie
    secure: process.env.NODE_ENV === 'production',    // Use secure cookies in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // cross-site in production - CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000,                  // 7 days in ms - Cookie expiration time
  });
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ─── Send Registration OTP ──────────────────────────────────
export const sendRegisterOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, phone } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) return res.status(400).json({ message: 'Phone number already registered' });


    // Delete any previous OTPs for this email + type
    await Otp.deleteMany({ email: email.toLowerCase(), type: 'registration' });

    const otp = generateOTP();
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      type: 'registration',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    await sendEmail(
      email,
      'Your Registration OTP — RealEstate App',
      `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#004798">Verify Your Email</h2>
        <p>Your OTP code is:</p>
        <div style="font-size:32px;letter-spacing:8px;font-weight:bold;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px">${otp}</div>
        <p style="color:#6b7280;font-size:14px;margin-top:16px">This code expires in 10 minutes. Do not share it.</p>
      </div>`
    );

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('sendRegisterOtp error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ─── Verify OTP & Register User : /api/auth/verify-otp-register
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone, role, otp } = req.body;

    // Check again for duplicate
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const existingPhone = await User.findOne({ phone: phone });
    if (existingPhone) return res.status(400).json({ message: 'Phone number already registered' });

    const record = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
      type: 'registration',
      expiresAt: { $gt: new Date() },
    });

    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone,
      role: role || 'User',
      isVerified: true,
    });

    await Otp.deleteMany({ email: email.toLowerCase(), type: 'registration' });

    const token = signToken(user._id);
    sendTokenCookie(res, token);               // set cookie

    res.status(201).json({
      message: 'Registration successful',
      // token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('verifyOtpAndRegister error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ─── Login ──────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user._id);
    sendTokenCookie(res, token);               // ← set cookie

    res.json({
      message: 'Login successful',
      // token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ─── Logout (client-side token removal) ─────────────────────
export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out successfully' });
};

// ─── Forgot Password — Send OTP ─────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    await Otp.deleteMany({ email: email.toLowerCase(), type: 'reset-password' });

    const otp = generateOTP();
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      type: 'reset-password',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendEmail(
      email,
      'Password Reset OTP — RealEstate App',
      `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#004798">Reset Your Password</h2>
        <p>Your OTP code is:</p>
        <div style="font-size:32px;letter-spacing:8px;font-weight:bold;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px">${otp}</div>
        <p style="color:#6b7280;font-size:14px;margin-top:16px">This code expires in 10 minutes.</p>
      </div>`
    );

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ message: 'Failed to send reset OTP' });
  }
};

// ─── Reset Password ─────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, otp, newPassword } = req.body;

    const record = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
      type: 'reset-password',
      expiresAt: { $gt: new Date() },
    });

    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    await Otp.deleteMany({ email: email.toLowerCase(), type: 'reset-password' });

    res.json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ message: 'Password reset failed' });
  }
};

// ─── Get Current User ───────────────────────────────────────
export const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    },
  });
};

// ─── Update Profile ─────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Profile update failed' });
  }
};
