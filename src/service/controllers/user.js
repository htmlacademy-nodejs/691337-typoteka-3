'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../storage-db`);
const {HttpCode, RegisterMessage} = require(`../../constants`);

const logger = getLogger();

module.exports.checkReaderExists = async (req, res, next) => {
  const existsReader = await storage.checkEmail(req.body);
  if (existsReader) {
    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.OK).json(RegisterMessage.READER_ALREADY_REGISTER);
  }

  return next();
};

module.exports.createReader = async (req, res) => {
  const user = await storage.addNewReader(req.body);
  logger.info(`End request with status code ${res.statusCode}`);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.status(HttpCode.CREATED).json(user);
};
