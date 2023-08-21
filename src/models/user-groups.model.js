import DataTypes from "sequelize";

export const userGroups = (sequelize, Sequelize, users, groups) => {
  const userGroups = sequelize.define(
    "user_groups",
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "id",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "user_id",
      },
      groupId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "group_id",
      },
      userType: {
        // type of user in a group
        type: DataTypes.ENUM("USER", "ADMIN"),
        defaultValue: "USER",
        field: "user_type",
      },
    },
    { timestamps: false, tableName: "user_groups" }
  );
  userGroups.belongsTo(users, { foreignKey: "userId", onDelete: "cascade" });
  userGroups.belongsTo(groups, { foreignKey: "groupId", onDelete: "cascade" });

  return userGroups;
};
