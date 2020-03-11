'use strict';

const express = require(`express`);
const loginRouter = new express.Router();

loginRouter.get(`/`, (req, res) => res.render(`auth/login`));

module.exports = loginRouter;
