import type { Request, Response } from "express";
import User from "../models/User";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const getProfileQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('coffeeProfile');
    
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    // Categories with questions
    const availableQuestions = {
      basic: {
        title: "☕️ BASICS",
        questions: [
          "What's your favorite type of coffee?",
          "What neighborhood do you live in?",
          "What's your favorite café in your area?",
          "Are you a morning or evening coffee person?",
          "What's your go-to pastry or snack with coffee?"
        ]
      },
      personality: {
        title: "💬 COFFEE PERSONALITY", 
        questions: [
          "What's your usual coffee order?",
          "What's your perfect coffee & music combo?",
          "How would you describe your coffee vibe?",
          "What café would you take a friend to?",
          "What café would you go to on a date?",
          "If your coffee style were a person, who would it be?"
        ]
      },
      taste: {
        title: "☁️ TASTE & ROAST PREFERENCES",
        questions: [
          "What's your favorite coffee bean origin?",
          "What's your roast preference?",
          "What's your favorite brewing method?",
          "What's your milk of choice?",
          "Do you add sugar or syrup?"
        ]
      },
      vibe: {
        title: "💫 VIBE & COMMUNITY",
        questions: [
          "What does coffee mean to you?",
          "What's your best coffee memory?",
          "Who is your ideal coffee mate?",
          "If you owned a café, what would it be like?",
          "What café do you dream of visiting one day?"
        ]
      }
    };
    console.log(availableQuestions.basic.questions)

    res.json({ 
      categories: availableQuestions,  
      answers: user.coffeeProfile || {}  
    });

  } catch (error) {
    console.error('❌ Get profile questions error:', error);
    res.status(500).json({ error: '❌ Server error fetching profile questions' });
  }
};

// Update profile answers
export const updateProfileAnswers = async (req: AuthRequest, res: Response) => {
  try {
    const { category, field, answer } = req.body; // Changed from 'question' to 'field'

    if (!req.user?.userId) {
      return res.status(401).json({ error: '❌ Not authenticated' });
    }

    // Build the update object based on your schema structure
    const updateQuery: any = {};
    updateQuery[`coffeeProfile.${category}.${field}`] = answer;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateQuery },
      { new: true }
    ).select('coffeeProfile');

    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    res.json({ 
      message: "✅ Answer saved successfully", 
      answers: user.coffeeProfile 
    });

  } catch (error) {
    console.error('❌ Update profile answers error:', error);
    res.status(500).json({ error: '❌ Server error saving answer' });
  }
};

// Update user profile (username, place, etc.)
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, place } = req.body; 

    if (!req.user?.userId) {
      return res.status(401).json({ error: '❌ Not authenticated' });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (username !== undefined) updateData.username = username;
    if (place !== undefined) updateData.place = place;

    console.log('📝 Update data to save:', updateData);
    // Check if username already exists (if updating username)

    // DEBUG: Check current user data
    const currentUser = await User.findById(req.user.userId);
    

    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user.userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ error: '❌ Username already taken' });
      }
    }
    const userBefore = await User.findById(req.user.userId).select('username place');
    console.log('👤 User before update:', userBefore?.toObject());

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, runValidators: true } // runValidators ensures schema validation
    ).select('+place'); 

    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    res.json({ 
      message: "✅ Profile updated successfully", 
      user: {
        id: user._id,
        username: user.username,
        place: user.place || "Unknown location",
        email: user.email,
        photoURL: user.photoURL
      }
    });

  } catch (error: any) {
    console.error('❌ Update user profile error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: '❌ Validation error', 
        details: error.message 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: '❌ Username or email already exists' 
      });
    }
    
    res.status(500).json({ error: '❌ Server error updating profile' });
  }
};