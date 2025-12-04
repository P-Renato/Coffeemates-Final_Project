import express from 'express';
import { uploadProfileImage, uploadCoverImage, updateProfileImages } from '../controllers/uploadController';
import {  uploadProfileMiddleware, uploadCoverMiddleware, uploadImages } from '../middlewares/uploadMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';


const router = express.Router();

// Single image upload routes
router.post('/profile', authenticateToken, uploadProfileMiddleware, (uploadProfileImage as any));
router.post('/cover', authenticateToken, uploadCoverMiddleware, (uploadCoverImage as any));

// Update both images at once
router.post('/images', authenticateToken, uploadImages, (updateProfileImages as any));

export default router;