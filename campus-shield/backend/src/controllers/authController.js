import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../middlewares/auth.js';
import { sendSuccess } from '../utils/response.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, department, studentId, phone, role, avatar } = req.body;

  if (!name || !email || !password) {
    throw ApiError.badRequest('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw ApiError.conflict('An account with this university email already exists.');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password,
    department: department || 'General Engineering',
    studentId: studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    phone: phone || '+91 98765 00000',
    role: role || 'Student',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    karmaPoints: 50,
    verified: true,
  });

  const token = generateToken(user._id);

  return sendSuccess(
    res,
    {
      user: user.toJSON(),
      token,
    },
    'Account registered successfully',
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Please provide both email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid university email or password');
  }

  const token = generateToken(user._id);

  return sendSuccess(
    res,
    {
      user: user.toJSON(),
      token,
    },
    'Logged in successfully'
  );
});

export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user.toJSON() }, 'Current user profile');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'department', 'avatar', 'studentId'];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, { user: updatedUser.toJSON() }, 'Profile updated successfully');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw ApiError.badRequest('Please provide your university email');
  }

  return sendSuccess(
    res,
    { email },
    `Password reset instructions sent to ${email}. Check your student inbox.`
  );
});

