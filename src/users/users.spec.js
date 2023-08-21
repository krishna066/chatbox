import db from "../models/index.js";
import { jest, test, expect } from "@jest/globals";
import { getAllUsers } from "./controllers.js";

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

db.users = {
  findAll: jest.fn(),
};

describe("users APIs", () => {
  it("should call findAll method once", async () => {
    const req = mockRequest();
    const res = mockResponse();

    db.users.findAll.mockResolvedValueOnce([]);

    await getAllUsers(req, res);

    expect(db.users.findAll).toHaveBeenCalledTimes(1);
  });
});
