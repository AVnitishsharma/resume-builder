import { JWTPayload } from '@/types/User.types';
import jwt from 'jsonwebtoken';

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { 
    expiresIn: '1h' 
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};