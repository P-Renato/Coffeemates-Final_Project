import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure main uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Create subdirectories
const profileDir = path.join(uploadsDir, 'profile');
const coverDir = path.join(uploadsDir, 'cover');
const postsDir = path.join(uploadsDir, 'posts');

[profileDir, coverDir, postsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('📁 Created directory:', dir);
  }
});

// Configure storage with proper subdirectories
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    
    // Determine destination based on field name
    if (file.fieldname === 'profileImage') {
      uploadPath = profileDir;
    } else if (file.fieldname === 'coverImage') {
      uploadPath = coverDir;
    } else if (req.baseUrl?.includes('/post') || file.fieldname === 'postImage') {
      uploadPath = postsDir;
    }
    
    console.log('💾 Saving', file.fieldname, 'to:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('📝 Generated filename:', filename, 'for', file.fieldname);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

console.log('✅ Multer middleware configured with subdirectories:');
console.log('   Profile images:', profileDir);
console.log('   Cover images:', coverDir);
console.log('   Post images:', postsDir);

// Single file upload middlewares
export const uploadProfileMiddleware = upload.single('profileImage');
export const uploadCoverMiddleware = upload.single('coverImage');
export const uploadImages = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// For posts
export const uploadPostImage = upload.single('postImage');


