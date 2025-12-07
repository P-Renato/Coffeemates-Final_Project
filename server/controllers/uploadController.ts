import type { Request, Response } from "express";
import User from "../models/User";
import type { AuthRequest } from "../middlewares/authMiddleware";
import path from "path";
import fs from "fs";

export const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: '❌ Not authenticated' });
    }

    console.log('📦 req.files:', req.files);
    console.log('📦 req.body:', req.body);
    console.log('📦 req.file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: '❌ No file uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    // Delete old profile image if it exists and is not default
    const userDoc = user as any;
    // if (userDoc.photoURL && userDoc.photoURL.startsWith('/uploads/')) {
    //   const oldImagePath = path.join(__dirname, '..', userDoc.photoURL);
    //   if (fs.existsSync(oldImagePath)) {
    //     fs.unlinkSync(oldImagePath);
    //   }
    // }

    // Update user with new image URL
    userDoc.photoURL = `/uploads/profile/${req.file.filename}`;
    await userDoc.save();

    res.json({
      message: '✅ Profile image uploaded successfully',
      photoURL: userDoc.photoURL
    });

  } catch (error) {
    console.error('❌ Upload profile image error:', error);
    res.status(500).json({ error: '❌ Server error uploading image' });
  }
};

export const uploadCoverImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: '❌ Not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: '❌ No file uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    // Delete old cover image if it exists and is not default
    // if (user.coverImageURL && !user.coverImageURL.includes('default-cover')) {
    //   const oldImagePath = path.join(__dirname, '..', user.coverImageURL);
    //   if (fs.existsSync(oldImagePath)) {
    //     fs.unlinkSync(oldImagePath);
    //   }
    // }

    // Update user with new cover image URL
    const userDoc = user as any;
    if (userDoc.coverImageURL && userDoc.coverImageURL.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '..', userDoc.coverImageURL);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new cover image URL
    userDoc.coverImageURL = `/uploads/cover/${req.file.filename}`;
    await userDoc.save();

    res.json({
      message: '✅ Cover image uploaded successfully',
      coverImageURL: userDoc.coverImageURL
    });
  } catch (error) {
    console.error('❌ Upload cover image error:', error);
    res.status(500).json({ error: '❌ Server error uploading image' });
  }
};

// For updating both images at once
export const updateProfileImages = async (req: AuthRequest, res: Response) => {
  try {
    console.log('✅ Update profile images route hit');
    console.log('📦 Request files:', req.files);
    console.log('👤 User ID:', req.user?.userId);

    if (!req.user?.userId) {
      return res.status(401).json({ error: '❌ Not authenticated' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const updateData: any = {};

    console.log('📁 Files received:', {
      hasProfileImage: !!files?.profileImage?.[0],
      hasCoverImage: !!files?.coverImage?.[0],
      profileImage: files?.profileImage?.[0]?.filename,
      coverImage: files?.coverImage?.[0]?.filename
    });

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: '❌ User not found' });
    }

    const userDoc = user as any;

    // Handle profile image
    if (files?.profileImage?.[0]) {
      const profileFile = files.profileImage[0]; // ✅ Get the file
      console.log('🖼️ Processing profile image:', profileFile.filename);
      
      // Delete old profile image if it exists
      // if (userDoc.photoURL && userDoc.photoURL.startsWith('/uploads/')) {
      //   const oldPath = path.join(__dirname, '..', userDoc.photoURL);
      //   console.log('🗑️ Deleting old profile image at:', oldPath);
      //   if (fs.existsSync(oldPath)) {
      //     fs.unlinkSync(oldPath);
      //   }
      // }
      
      updateData.photoURL = `/uploads/profile/${profileFile.filename}`; // ✅ Use profileFile, not req.file
      console.log('💾 New profile URL:', updateData.photoURL);
    }

    // Handle cover image
    if (files?.coverImage?.[0]) {

      const coverFile = files.coverImage[0];
      console.log('🖼️ Processing cover image:', coverFile.filename);
      // Delete old cover image
      // if (userDoc.coverImageURL && userDoc.coverImageURL.startsWith('/uploads/')) {
      //   const oldPath = path.join(__dirname, '..', userDoc.coverImageURL);
      //   if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      // }
      updateData.coverImageURL = `/uploads/cover/${coverFile.filename}`; 
      console.log('💾 New cover URL:', updateData.coverImageURL);
    }

    console.log('📝 Update data:', updateData);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: '❌ No images uploaded' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true }
    ).select('photoURL coverImageURL username');

    console.log('✅ Updated user:', updatedUser);

    if (files?.profileImage?.[0]) {
      const savedPath = path.join(__dirname, '..', 'uploads', 'profile', files.profileImage[0].filename);
      console.log('💾 Profile image saved at:', savedPath);
      console.log('📁 File exists?', fs.existsSync(savedPath));
    }
    
    if (files?.coverImage?.[0]) {
      const savedPath = path.join(__dirname, '..', 'uploads', 'cover', files.coverImage[0].filename);
      console.log('💾 Cover image saved at:', savedPath);
      console.log('📁 File exists?', fs.existsSync(savedPath));
    }

    res.json({
      message: '✅ Images updated successfully',
      user: updatedUser
    });
    

  } catch (error) {
    console.error('❌ Update images error:', error);
    res.status(500).json({ error: '❌ Server error updating images' });
  }
};