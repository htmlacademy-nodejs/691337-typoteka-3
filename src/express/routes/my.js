'use strict';

const express = require(`express`);
const controller = require(`../controllers/my`);
const {authAdmin} = require(`../jwt-auth`);
const myRouter = new express.Router();

myRouter.get(`/`, authAdmin, controller.getArticles);
myRouter.get(`/comments`, authAdmin, controller.getComments);

module.exports = myRouter;
