const { Sequelize } = require("sequelize");
const config = require("../config/db.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  { host: dbConfig.host, dialect: dbConfig.dialect, logging: false }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize);
db.Product = require("./Product")(sequelize);

module.exports = db;