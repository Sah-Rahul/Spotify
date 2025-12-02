import axios from "axios";
import { Request, Response, NextFunction } from "express";

interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
  playlist: string[];
}

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

const USER_SERVICES_URL = process.env.USER_SERVICES_URL;

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const { data } = await axios.get(`${USER_SERVICES_URL}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    req.user = data.data;

    console.log("User object from auth middleware:====>", req.user);

    next();
  } catch (error: any) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};
