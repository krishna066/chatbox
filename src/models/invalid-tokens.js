export const invalidTokens = (sequelize, Sequelize) => {
  const invalidTokens = sequelize.define(
    "invalid-tokens",
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        field: "user_id",
      },
      blockedToken: {
        type: Sequelize.STRING,
        field: "blocked-token",
      },
    },
    { timestamps: false, tableName: "invalid-tokens" }
  );

  return invalidTokens;
};
