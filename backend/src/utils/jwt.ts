import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (res: Response, userId: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const token = jwt.sign({ userId, role }, secret, {
    expiresIn: '30d',
  });

  return token;
};
