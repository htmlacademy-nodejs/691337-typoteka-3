'use strict';
const jwt = require(`jsonwebtoken`);
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../db-service/storage-db`);
const {HttpCode, RegisterMessage, LoginMessage} = require(`../../constants`);
const {comparePassHashSum, makeTokens} = require(`../../utils`);
const {JWT_REFRESH_SECRET} = require(`../../db-service/config`);

const logger = getLogger();

module.exports.checkReaderExists = async (req, res, next) => {
  const existsReader = await storage.checkEmail(req.body);

  if (existsReader) {
    logger.error(`End request with error ${HttpCode.BAD_REQUEST}`);
    return res.status(HttpCode.BAD_REQUEST).json([RegisterMessage.READER_ALREADY_REGISTER]);
  }

  return next();
};

module.exports.authenticateReader = async (req, res, next) => {
  const existsReader = await storage.checkEmail(req.body);

  if (!existsReader) {
    logger.error(`End request with error ${HttpCode.FORBIDDEN}`);
    return res.status(HttpCode.FORBIDDEN).json(LoginMessage.WRONG_DATA);
  }

  const isPasswordCorrect = await comparePassHashSum(existsReader, req.body.pass);

  if (!isPasswordCorrect) {
    logger.error(`End request with error ${HttpCode.FORBIDDEN}`);
    return res.status(HttpCode.FORBIDDEN).json(LoginMessage.WRONG_DATA);
  }
  res.locals.user = existsReader;
  return next();
};

module.exports.createReader = async (req, res) => {
  const user = await storage.addNewReader(req.body);
  logger.info(`End request with status code ${res.statusCode}`);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.status(HttpCode.CREATED).json(user);
};

module.exports.makeTokens = async (req, res) => {
  const reader = res.locals.user;
  const {id, firstname, lastname, role, avatar} = reader;

  const {accessToken, refreshToken} = makeTokens({id, firstname, lastname, role, avatar});
  await storage.addRefreshToken(refreshToken);
  return res.json({accessToken, refreshToken, reader});
};

module.exports.refreshToken = async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) {
    logger.error(`End request with error ${HttpCode.BAD_REQUEST}`);
    return res.status(HttpCode.BAD_REQUEST).end();
  }

  const currentToken = await storage.findRefreshToken(token);

  if (!currentToken) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  return jwt.verify(token, JWT_REFRESH_SECRET, async (err, userData) => {

    if (err) {
      logger.error(`End request with error ${HttpCode.FORBIDDEN}`);
      return res.status(HttpCode.FORBIDDEN).end();
    }

    const {id, firstname, lastname, role, avatar} = userData;
    const {accessToken, refreshToken} = makeTokens({id, firstname, lastname, role, avatar});
    await storage.deleteRefreshToken(currentToken);
    await storage.addRefreshToken(refreshToken);
    return res.json({accessToken, refreshToken});
  });
};

module.exports.logout = async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) {
    logger.error(`End request with error ${HttpCode.BAD_REQUEST}`);
    return res.status(HttpCode.BAD_REQUEST).end();
  }

  const currentToken = await storage.findRefreshToken(token);

  if (!currentToken) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  await storage.deleteRefreshToken(currentToken);

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};
