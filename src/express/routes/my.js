'use strict';

const express = require(`express`);
const myRouter = new express.Router();

myRouter.get(`/`, (req, res) => res.send(`/my`));
myRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));

module.exports = myRouter;
