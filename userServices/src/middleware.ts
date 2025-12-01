import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TryCatch from "./TryCatch";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export const isAuthenticated = TryCatch(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.userId = decoded.id;  
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
);
