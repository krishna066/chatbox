import dotenv from "dotenv";
dotenv.config();
/**
 *
 *
 *
 * First five parameters are for PostgreSQL connection.
 *
 * pool is optional, it will be used for Sequelize connection pool configuration:
 * max: maximum number of connections in pool
 * min: minimum number of connection/s in pool
 * idle: maximum time, in milliseconds, that a connection can be idle before being released
 * acquire: maximum time, in milliseconds, that pool will try to get connection before throwing error
 */

export default {
  HOST: process.env.HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  dialect: process.env.DIALECT,
  PORT: process.env.PORT,
  pool: {
    max: parseInt(process.env.MAX),
    min: parseInt(process.env.MIN),
    acquire: process.env.ACQUIRE,
    idle: process.env.IDLE,
  },
};

/* 
local
export default {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "divami@12345",
    DB: "testdb",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
*/
