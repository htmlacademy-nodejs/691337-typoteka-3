'use strict';

const express = require(`express`);
const myRouter = new express.Router();

myRouter.get(`/`, (req, res) => res.render(`articles/my`));
myRouter.get(`/comments`, (req, res) => res.render(`comments`));

module.exports = myRouter;
