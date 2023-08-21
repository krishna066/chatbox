import DataTypes from "sequelize";

export const users = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "user_id",
      },
      userName: {
        type: Sequelize.STRING,
        unique: true,
        field: "user_name",
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        field: "email",
      },
      pswd: {
        type: Sequelize.STRING,
        field: "pswd",
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
    { timestamps: false, tableName: "users" }
  );

  return users;
};
