'use strict';

const axios = require(`axios`);
const jwt = require(`jsonwebtoken`);
const decodeJwt = require(`jwt-decode`);
const {getLogger} = require(`../logger`);
const {JWT_ACCESS_SECRET} = require(`../db-service/config`);
const {URL, HttpCode} = require(`../constants`);
const logger = getLogger();

module.exports.authAdmin = async (req, res, next) => {

  const {accessToken, refreshToken} = req.cookies;

  if (!accessToken) {
    logger.error(`End request with error ${HttpCode.UNAUTHORIZED}`);
    return res.status(HttpCode.UNAUTHORIZED).end();
  }

  const {role} = await decodeJwt(accessToken);

  if (role !== `author`) {
    return res.redirect(`../`);
  }

  try {
    jwt.verify(accessToken, JWT_ACCESS_SECRET);
  } catch (err) {
    try {
      const response = await axios.post(`${URL}/user/refresh`, {refreshToken});
      await res.clearCookie(`accessToken`);
      await res.clearCookie(`refreshToken`);
      await res.cookie(`accessToken`, `${response.data.accessToken}`);
      await res.cookie(`refreshToken`, `${response.data.refreshToken}`);
      return next();
    } catch (error) {
      logger.error(`End request with error ${HttpCode.FORBIDDEN}`);
      return res.redirect(`../login`);
    }
  }

  return next();
};
