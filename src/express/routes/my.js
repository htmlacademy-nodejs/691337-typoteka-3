'use strict';

const express = require(`express`);
const controller = require(`../controllers/my`)
const myRouter = new express.Router();

myRouter.get(`/`, controller.getArticles);
myRouter.get(`/comments`, controller.getComments);

module.exports = myRouter;
