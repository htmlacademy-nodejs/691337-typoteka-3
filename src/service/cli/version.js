'use strict';

const {getLogger} = require(`../../logger`);
const packageJsonFile = require(`../../../package.json`);

const logger = getLogger();

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    logger.info(version);
  },
};
