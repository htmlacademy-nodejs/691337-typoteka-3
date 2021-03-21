'use strict';
const express = require(`express`);
const controller = require(`../controllers/user`);
const checkValidity = require(`../validation/validator`);
const userSchema = require(`../validation/schemes/user-schema`);

const userRouter = new express.Router();

userRouter.post(`/`, [checkValidity(userSchema), controller.checkReaderExists], controller.createReader);
userRouter.post(`/login`, controller.authenticateReader, controller.makeTokens);
userRouter.post(`/refresh`, controller.refreshToken);
userRouter.post(`/logout`, controller.logout);

module.exports = userRouter;
