'use strict';

const {Sequelize} = require(`sequelize`);
const {DB_HOST, DB_USER, DB_NAME, DB_PASS, DB_DIALECT} = require(`./config`);
const {getLogger} = require(`../src/logger`);

const logger = getLogger();

module.exports = async () => {
  const sequelize = new Sequelize(
      DB_NAME,
      DB_USER,
      DB_PASS,
      {
        host: DB_HOST,
        dialect: DB_DIALECT,
      }
  );

  try {
    logger.info(`Starting connection to database ${DB_NAME}`);
    await sequelize.authenticate();
    logger.info(`Database connection successful`);
  } catch (err) {
    logger.error(`Connection error: ${err}`);
  }
};
