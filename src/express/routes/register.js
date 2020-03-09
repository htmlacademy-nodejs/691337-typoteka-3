'use strict';

const express = require(`express`);
const registerRouter = new express.Router();

registerRouter.get(`/`, (req, res) => res.render(`auth/sign-up`));

module.exports = registerRouter;
