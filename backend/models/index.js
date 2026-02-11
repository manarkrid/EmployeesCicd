const Sequelize = require("sequelize");
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || "employee_db";
const DB_USER = process.env.DB_USER || "user";
const DB_PASSWORD = process.env.DB_PASSWORD || "password";
const DB_HOST = process.env.DB_HOST || "db";
const DB_DIALECT = process.env.DB_DIALECT || "mysql";

console.log(`Initializing Sequelize with dialect: ${DB_DIALECT} on host: ${DB_HOST}`);

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: DB_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employees = require("./employee.model.js")(sequelize, Sequelize);

module.exports = db;
