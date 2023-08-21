import DataTypes from "sequelize";

export const groups = (sequelize, Sequelize) => {
  const groups = sequelize.define(
    "groups",
    {
      groupId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "group_id",
      },
      groupName: {
        type: Sequelize.STRING,
        unique: true,
        field: "group_name",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("now()"),
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("now()"),
        field: "updated_at",
      },
    },
    { timestamps: false, tableName: "groups" }
  );

  return groups;
};
