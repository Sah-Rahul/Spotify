import { Request, Response } from "express";
import TryCatch from "./TryCatch";

export const registerUser = TryCatch(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  res
    .status(201)
    .json({ message: "User registered", data: { username, email } });
});
