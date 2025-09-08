import { Sequelize } from "sequelize";
import config from "../config/db.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];
if (!dbConfig) throw new Error(`Config para '${env}' não encontrada.`);

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  { host: dbConfig.host, dialect: dbConfig.dialect, logging: false }
);
