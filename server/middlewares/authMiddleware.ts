import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth'; 

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {

    let token = req.cookies.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return res.status(401).json({ error: '❌ Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    
    (req as AuthRequest).user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return res.status(401).json({ error: '❌ Invalid or expired token' });
  }
};