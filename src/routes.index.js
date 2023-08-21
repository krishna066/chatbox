import express from "express";
import { userRouter } from "./users/routes.js";
import { groupsRouter } from "./groups/routes.js";
export const indexRouter = new express.Router();

indexRouter.use(userRouter);
indexRouter.use(groupsRouter);
