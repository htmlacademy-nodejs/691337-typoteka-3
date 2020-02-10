'use strict';

module.exports.USER_ARGV_INDEX = 2;
module.exports.DEFAULT_COMMAND = `--help`;
module.exports.ExitCode = {
  success: 0,
  error: 1,
};
module.exports.HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};
