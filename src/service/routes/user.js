'use strict';
const express = require(`express`);
const controller = require(`../controllers/user`);
const checkValidity = require(`../validation/validator`);
const userSchema = require(`../validation/schemes/user-schema`);

const userRouter = new express.Router();

userRouter.post(`/`, [checkValidity(userSchema), controller.checkReaderExists], controller.createReader);

module.exports = userRouter;
