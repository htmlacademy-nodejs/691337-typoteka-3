'use strict';

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../../logger`);

const logger = getLogger();

const MESSAGE = `Not correct data type by`;
const isInteger = (param) => Number.isInteger(Number(param));

module.exports = (param) => (req, res, next) => {
  if (!isInteger(req.params[param])) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).json(`${MESSAGE} ${param}`);
  }
  return next();
};
