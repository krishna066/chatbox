import db from "../models/index.js";
import { jest, expect } from "@jest/globals";
import { createGroup } from "./controllers.js";

const mockRequest = () => {
  const req = {};
  req.body = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

db.groups = {
  create: jest.fn(),
};

db.userGroups = {
  bulkCreate: jest.fn(),
};

describe("groups APIs", () => {
  it("should create a group with the passed data", async () => {
    const req = mockRequest();
    const res = mockResponse({ status: jest.fn() });

    const mockGroupData = {
      groupName: "Test Group",
      groupId: "7e3e569e-0bba-4e77-be07-a25de13c827f",
    };
    db.groups.create.mockResolvedValueOnce(mockGroupData);
    db.userGroups.bulkCreate.mockResolvedValueOnce([
      {
        userId: "123e569e-0bba-4e77-be07-a25de13c827m",
        userType: "user",
        groupId: "7e3e569e-0bba-4e77-be07-a25de13c827f",
      },
    ]);

    req.body = {
      groupName: "Test Group",
      users: [
        { userId: "123e569e-0bba-4e77-be07-a25de13c827m", userType: "USER" },
      ],
    };

    await createGroup(req, res);

    expect(db.groups.create).toHaveBeenCalledWith({ groupName: "Test Group" });
  });

  it("should not call userGroups.bulkCreate where there are no users", async () => {
    const req = mockRequest();
    const res = mockResponse();

    db.groups.create.mockRejectedValueOnce("Database error");

    req.body = {
      groupName: "Test Group",
      users: [],
    };

    await createGroup(req, res);

    expect(db.groups.create).toHaveBeenCalledWith({ groupName: "Test Group" });
    expect(db.userGroups.bulkCreate).not.toHaveBeenCalled();
  });
});
