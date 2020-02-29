'use strict';

const express = require(`express`);
const registerRouter = new express.Router();

registerRouter.get(`/`, (req, res) => res.send(`/register`));

module.exports = registerRouter;
