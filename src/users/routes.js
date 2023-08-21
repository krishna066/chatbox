import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  userLogin,
  userLogout,
} from "./controllers.js";
import { verifyToken } from "../auth-utils/auth.js";
export const userRouter = new express.Router();
userRouter.post("/user", createUser);
userRouter.post("/login", userLogin);
userRouter.post("/logout", verifyToken, userLogout);
userRouter.get("/user", verifyToken, getAllUsers);
userRouter.put("/user", updateUser);
userRouter.delete("/user/:userId", deleteUser);
