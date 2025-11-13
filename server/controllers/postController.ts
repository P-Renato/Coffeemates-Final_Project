import type { Request, Response } from "express";
import { Post } from "../models/Post"

export const allPosts = async(req: Request, res:Response) =>  {
    try {
        const posts = await Post.find();
        res.status(201).json({success: true, posts})

    } catch (err) {
        res.status(500).json({success: false, msg: "allPosts error!"})
    }
}

export const onePost = async(req: Request, res:Response) =>  {

}

export const editPost = async(req: Request, res:Response) =>  {

}

export const addNewPost = async(req: Request, res:Response) =>  {
    try {
        const { content, uid, imageUrl, commentIds, likeIds} = req.body;
        const newPost = await Post.create({content, uid, imageUrl, commentIds, likeIds});
        res.status(201).json({success: true, newPost})
    } catch (err) {
        res.status(400).json({success: false, msg: "addnewPost error!"})
    }
}