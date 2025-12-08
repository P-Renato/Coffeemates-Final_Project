import type { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { generateToken } from "../utils/auth";
import type { AuthRequest } from "../middlewares/authMiddleware";
import type { IUser } from "../libs/types";


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      res.status(401).send('❌ Missing credential');
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: "❌ User already exists"
      });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: ' ✅ User created successfully',
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: token
    })


  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error ❌  during registration' })
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        error: 'Username/email and password are required'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login }
      ]
    });


    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' })
      return
    }

    const isPasswordValid = await user.comparePassword(password);

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: '✅ Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photoURL: user.photoURL,
        token: token
      }
    });


  } catch (error) {
    console.error(' ❌  Login error:', error);
    res.status(500).json({ error: ' ❌  Server error during login' });
  }
}


// This route is to get the currently logged in user's own profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const user = await User.findById(userId).select('username email place photoURL createdAt updatedAt');

    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    const userObj = (user as any).toObject ? (user as any).toObject() : (user as any);

    res.json({
      user: {
        id: userObj._id,
        username: userObj.username,
        email: userObj.email,
        place: userObj.place || "Unknown location",
        photoURL: userObj.photoURL, 
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ error: '❌ Server error fetching user' });
  }
};

// This route is to get a user's profile publicly, it doesn't need to be your own profile
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('username photoURL coverImageURL place createdAt');

    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    const userObj = (user as any).toObject ? (user as any).toObject() : (user as any);


    res.json({
      user: {
        id: userObj._id,
        username: userObj.username,
        place: userObj.place || "Unknown location",
        photoURL: userObj.photoURL,
        coverImageURL: userObj.coverImageURL || "",
        createdAt: userObj.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Get user by ID error:', error);
    res.status(500).json({ error: '❌ Server error fetching user' });
  }
};


// Get all users (with pagination)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;  // change to load more users per page
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });

  } catch (error) {
    console.error('❌ Get all users error:', error);
    res.status(500).json({ error: '❌ Server error fetching users' });
  }
};


// Update user profile
export const updateUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { username, email, place } = req.body;

    if (!userId) {
      return res.status(401).json({ error: '❌ Not authenticated' });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } }, // Not the current user
          { $or: [{ email }, { username }] }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          error: '❌ Username or email already taken'
        });
      }
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (place !== undefined) updateData.place = place;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    const userObj = (updatedUser as any).toObject ? (updatedUser as any).toObject() : (updatedUser as any);


    res.json({
      message: '✅ Profile updated successfully',
      user: {
        id: userObj._id,
        username: userObj.username,
        email: userObj.email,
        place: userObj.place || "Unknown location",
        updatedAt: userObj.updatedAt
      }
    });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    console.error('❌ Update user error:', error);
    res.status(500).json({ error: '❌ Server error updating profile' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ error: '❌ Not authenticated' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: '❌ Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: '❌ New password must be at least 6 characters'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: '❌ Current password is incorrect' });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: '✅ Password updated successfully' });

  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ error: '❌ Server error changing password' });
  }
};

// search users by username
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Missing search query" });
    }

    const users = await User.find(
      { username: { $regex: q, $options: "i" } }, // case-insensitive contains
      { _id: 1, username: 1 }                      // select only needed fields
    );

    res.json({ users });

  } catch (error) {
    console.error("❌ Search users error:", error);
    res.status(500).json({ error: "❌ Server error searching users" });
  }
};


// Add these to your existing userController.ts

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
   console.log('DELETE called for user ID:', id);
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        username: deletedUser.username,
        email: deletedUser.email
      }
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, isActive } = req.body;
   
    console.log('UPDATE STATUS called:', { id, status, isActive });
   
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
   
    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (isActive !== undefined) updates.isActive = isActive;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    console.log('✅ Status updated:', (updatedUser as IUser).username);
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

