import express from 'express';
import multer from "multer";
import path from "path";
import { allPosts, addNewPost, onePost, editPost, deletePost, likePost, getPostsByUserId } from '../controllers/postController';

const posts = express.Router();

// configuration for file upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/posts"), 
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split(".").pop();
    const fileName = file.originalname.split(".")[0];
    const newFileName = `${fileName}-${Date.now()}.${fileExt}`;
    cb(null, newFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB 
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});

// Routes
posts.get("/", allPosts);        
posts.post("/", upload.single("postImg"), addNewPost);  
posts.get("/user/:userId", getPostsByUserId);
posts.patch("/like/:id", likePost); 
posts.get("/:id", onePost);      
posts.patch("/:id", upload.single("postImg"), editPost);  
posts.delete("/:id", deletePost);

export default posts;
