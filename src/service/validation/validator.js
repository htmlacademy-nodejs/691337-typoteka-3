'use strict';

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../../logger`);

const logger = getLogger();

module.exports = (schema) => (
  async (req, res, next) => {
    const data = req.body;

    try {
      await schema.validateAsync(data, {abortEarly: false});
    } catch (err) {
      const errorsList = err.details;
      logger.error(`End request with error ${HttpCode.BAD_REQUEST} ${errorsList.map((it) => it.message)}`);
      res.status(HttpCode.BAD_REQUEST).json(errorsList);
      return;
    }
    next();
  }
);
