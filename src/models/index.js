/**
 * Initializing Sequelize here
 * We have to call sync() method in server.js
 */

import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import { users } from "./users.model.js";
import { groups } from "./groups.model.js";
import { userGroups } from "./user-groups.model.js";
import { invalidTokens } from "./invalid-tokens.js";
// import { userRoles } from "./userRoles.model.js";

export const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.DB_PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = users(sequelize, Sequelize);
db.groups = groups(sequelize, Sequelize);
db.userGroups = userGroups(sequelize, Sequelize, db.users, db.groups);
db.invalidTokens = invalidTokens(sequelize, Sequelize);

//---------------------------------------------------<< PARENT TYPE - RELATIONS >>--------------------------------------------------------

db.users.hasMany(db.userGroups, {
  foreignKey: "userId",
});
db.groups.hasMany(db.userGroups, {
  foreignKey: "groupId",
});

export default db;
