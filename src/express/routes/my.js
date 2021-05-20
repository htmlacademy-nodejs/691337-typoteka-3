'use strict';

const express = require(`express`);
const csrf = require(`csurf`);
const controller = require(`../controllers/my`);
const {authAdmin} = require(`../jwt-auth`);

const myRouter = new express.Router();
const csrfProtection = csrf({cookie: true});

myRouter.get(`/`, [csrfProtection, authAdmin], controller.getArticles);
myRouter.get(`/comments`, authAdmin, controller.getComments);

module.exports = myRouter;
