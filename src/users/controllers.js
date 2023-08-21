import db from "../models/index.js";
import bcrypt from "bcrypt";
import { createJWT } from "../auth-utils/auth.js";

export const createUser = async (req, res) => {
  try {
    console.log("user-Info", req.body);
    const userInfo = req.body;
    let hashPswd = "";
    const saltRounds = 10;
    hashPswd = await bcrypt.hash(userInfo.pswd, saltRounds);

    const userData = await db.users.create({
      userName: userInfo.userName,
      email: userInfo.email,
      pswd: hashPswd,
    });
    let { pswd, ...result } = userData.dataValues;
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.users.findAll();
    console.log("API HIT");
    return res.status(200).send({ data: { users } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("body", req.body);
    const userInfo = req.body;
    const userData = await db.users.update(
      {
        email: userInfo.email,
        userName: userInfo.userName,
      },
      {
        where: {
          userId: userInfo.userId,
        },
      }
    );
    console.log("API HIT", userData);
    return res
      .status(200)
      .send({ message: "User data updated successfully", data: { userInfo } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log("body", req.body);
    const userId = req.params.userId;
    const userData = await db.users.destroy({
      where: {
        userId,
      },
    });
    console.log("API HIT", userData);
    return res
      .status(200)
      .send({ message: "User deleted successfully", data: { userId } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const userLogin = async (req, res) => {
  try {
    const loginData = req.body;
    const userData = await db.users.findOne({
      where: { userName: loginData.userName },
    });
    const valid = await bcrypt.compare(loginData.pswd, userData.pswd);
    if (valid) {
      const tokenUserInfo = {
        userId: userData.userId,
        username: userData.userName,
      };
      const token = await createJWT(tokenUserInfo, process.env.JWT_EXPIRE_TIME);

      return res.status(200).send({
        message: "Login successfull",
        data: { loginStatus: true, token },
      });
    } else {
      return res
        .status(401)
        .send({ message: "Login failed", data: { loginStatus: false } });
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const userLogout = async (req, res) => {
  try {
    console.log({
      blockedToken: req.headers.authorization,
    });
    await db.invalidTokens.create({
      blockedToken: req.headers.authorization,
    });
    return res.status(200).send({ message: "User logged out" });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};
