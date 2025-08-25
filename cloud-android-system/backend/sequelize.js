import { Sequelize } from "sequelize";

const {
  DB_HOST = "db",
  DB_PORT = "5432",
  DB_USER = "appuser",
  DB_PASS = "apppass",
  DB_NAME = "appdb",
  NODE_ENV = "development",
} = process.env;

export const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  logging: NODE_ENV === "development" ? console.log : false,
});
