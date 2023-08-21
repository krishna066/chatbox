import express from "express";
import {
  createGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
  manageGroupMembers,
  addMemberToGroup,
  getGroupData,
  searchGroups,
} from "./controllers.js";
export const groupsRouter = new express.Router();
groupsRouter.post("/group", createGroup);
groupsRouter.post("/group/add-member", addMemberToGroup);
groupsRouter.get("/group", getAllGroups);
groupsRouter.get("/group/:groupId", getGroupData);
groupsRouter.get("/search-groups", searchGroups);
groupsRouter.put("/group/:groupId", updateGroup);
groupsRouter.put("/group/:groupId/members", manageGroupMembers);
groupsRouter.delete("/group/:groupId", deleteGroup);
