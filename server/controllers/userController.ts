import type { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { generateToken } from "../utils/auth";


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, email } = req.body;

        if(!username || !password || !email) {
            res.status(401).send('❌ Missing credential');
            return;
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if(existingUser) {
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
            email: newUser.email
        })

        
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(500).json({ error: 'Server error ❌  during registration'})
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

        
        if(!user) {
            res.status(400).json({ error: 'Invalid credentials'})
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
                email: user.email
            }
        });


    } catch (error) {
        console.error(' ❌  Login error:', error);
        res.status(500).json({ error: ' ❌  Server error during login' });
    }
}