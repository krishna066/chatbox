import { userType } from "../constants.js";
import db from "../models/index.js";
const Op = db.Sequelize.Op;
export const createGroup = async (req, res) => {
  try {
    console.log("group-Info", req.body);
    const groupInfo = req.body;
    let groupUsers = [];
    const groupData = await db.groups.create({
      groupName: groupInfo.groupName,
    });
    if (!groupData.hasOwnProperty("dataValues")) {
      throw "Group not created";
    }
    console.log("groupData", groupData);
    if (groupInfo.users.length) {
      const groupMembers = groupInfo.users.map((userInfo) => {
        return {
          userId: userInfo.userId,
          userType: userInfo.userType || userType.user,
          groupId: groupData.groupId,
        };
      });

      groupUsers = await db.userGroups.bulkCreate(groupMembers);
      console.log("groupUsers", groupUsers);
    }

    return res.status(200).send({ data: { groupData, groupUsers } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    console.log("group-Info", req.body);
    const payload = req.body;
    const insertResult = await db.userGroups.create({
      userId: payload.userId,
      groupId: payload.groupId,
      userType: payload.userType,
    });
    console.log("insertResult", insertResult);

    return res.status(200).send({
      message: "User added successfully to the group",
      data: { user: insertResult },
    });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await db.groups.findAll({
      include: {
        model: db.userGroups,
        include: [db.users],
      },
    });
    console.log(
      "LLLLL",
      await checkUserIsAdminofGroup(
        "0c4d620e-94b9-465e-a0bd-64d33546c476",
        "f2a82846-7cfa-4918-8b43-a446055e1a63"
      )
    );
    const formattedGroupsList = groups.map((grp) => {
      const { groupId, groupName, createdAt, updatedAt } = grp;
      let groupMembers = [];
      if (grp.user_groups) {
        groupMembers = grp.user_groups.map((memberObj) => {
          const { id, userId, groupId, userType } = memberObj;
          let { userName, email } = memberObj.user;
          return {
            id,
            userId,
            groupId,
            userType,
            userName,
            email,
          };
        });
      }
      return { groupId, groupName, createdAt, updatedAt, groupMembers };
    });
    console.log("API HIT");
    return res.status(200).send({ data: { groups: formattedGroupsList } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const searchGroups = async (req, res) => {
  try {
    const searchString = req.query.groupName || "";
    const groups = await db.groups.findAll({
      where: searchString.length
        ? {
            groupName: { [Op.iLike]: `%${searchString}%` },
          }
        : true,
    });
    console.log(
      "LLLLL",
      await checkUserIsAdminofGroup(
        "0c4d620e-94b9-465e-a0bd-64d33546c476",
        "f2a82846-7cfa-4918-8b43-a446055e1a63"
      )
    );

    console.log("API HIT");
    return res.status(200).send({ data: { groups: groups } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const updateGroup = async (req, res) => {
  try {
    console.log("body", req.body);
    const groupId = req.params.groupId;
    const groupInfo = req.body;
    const groupData = await db.groups.update(
      {
        groupName: groupInfo.groupName,
      },
      {
        where: {
          groupId,
        },
      }
    );
    console.log("API HIT", groupData);
    return res.status(200).send({
      message: "Group data updated successfully",
      data: { groupName: groupInfo.groupName },
    });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const manageGroupMembers = async (req, res) => {
  try {
    console.log("body", req.body);
    const groupId = req.params.groupId;
    const groupMembers = req.body.groupMembers;
    const insertGroupMembersList = groupMembers.map((item) => {
      return { ...item, groupId };
    });
    await db.userGroups.destroy({
      where: {
        groupId,
      },
    });
    const groupMembersInsertResult = await db.userGroups.bulkCreate(
      insertGroupMembersList
    );

    console.log("API HIT", groupMembersInsertResult);
    return res.status(200).send({
      message: "Group members list updated successfully",
      data: { groupMembers: groupMembersInsertResult },
    });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    console.log("body", req.body);
    const groupId = req.params.groupId;
    const result = await db.groups.destroy({
      where: {
        groupId,
      },
    });
    console.log("API HIT", result);
    return res
      .status(200)
      .send({ message: "Group deleted successfully", data: { groupId } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};

export const checkUserIsAdminofGroup = async (userId, groupId) => {
  const groupsResult = await db.userGroups.findAll({
    where: {
      userId,
      groupId,
    },
  });
  if (
    groupsResult &&
    groupsResult.length &&
    groupsResult[0].userType &&
    groupsResult[0].userType === userType.admin
  ) {
    return true;
  }
  return false;
};

export const getGroupData = async (req, res) => {
  try {
    const group = await db.groups.findOne({
      where: { groupId: req.params.groupId },
      include: {
        model: db.userGroups,
        include: [db.users],
      },
    });
    console.log(
      "LLLLL",
      await checkUserIsAdminofGroup(
        "0c4d620e-94b9-465e-a0bd-64d33546c476",
        "f2a82846-7cfa-4918-8b43-a446055e1a63"
      )
    );
    const [formattedGroupData] = [group].map((grp) => {
      const { groupId, groupName, createdAt, updatedAt } = grp;
      let groupMembers = [];
      if (grp.user_groups) {
        groupMembers = grp.user_groups.map((memberObj) => {
          const { id, userId, groupId, userType } = memberObj;
          let { userName, email } = memberObj.user;
          return {
            id,
            userId,
            groupId,
            userType,
            userName,
            email,
          };
        });
      }
      return { groupId, groupName, createdAt, updatedAt, groupMembers };
    });
    console.log("API HIT");
    return res.status(200).send({ data: { groupData: formattedGroupData } });
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ success: false, data: err });
  }
};
