import { Router } from "express";
import { loginUser, logOut, myProfile, registerUser } from "./user.controller"
import { isAuthenticated } from "./middleware"

const userRouter = Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/me",isAuthenticated, myProfile)
userRouter.post("/logout", logOut)


export default userRouter