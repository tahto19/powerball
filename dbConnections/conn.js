import { Sequelize } from "sequelize";
import { logger } from "../util/util.js";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logger: false,
  }
);

const auth = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (err) {
    logger.error(err);
  }
};

const sync = async () => {
  try {
    logger.info("Starting to Sync");
    await sequelize.sync({ force: false, alter: true });
    logger.info("Sync was successful");
  } catch (err) {
    logger.error(err);
  }
};
export default {
  sequelize,
  sync,
  auth,
};
