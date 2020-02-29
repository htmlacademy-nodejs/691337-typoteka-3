'use strict';

const express = require(`express`);
const loginRouter = new express.Router();

loginRouter.get(`/`, (req, res) => res.send(`/login`));

module.exports = loginRouter;
