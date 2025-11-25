import type { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/auth';


export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    // Return user data with role
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user', // Include role, default to 'user'
        // Add other fields you need
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: ' Server error during login' 
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: 'user' // Default role
    });

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration'
    });
  }
};