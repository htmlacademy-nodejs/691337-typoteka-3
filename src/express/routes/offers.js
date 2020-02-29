'use strict';

const express = require(`express`);
const offersRouter = new express.Router();

offersRouter.get(`/category/:id`, (req, res) => res.send(`/offers/category/${req.params.id}`));
offersRouter.get(`/add`, (req, res) => res.send(`/offers/add`));
offersRouter.get(`/edit/:id`, (req, res) => res.send(`/offers/edit/${req.params.id}`));
offersRouter.get(`/:id`, (req, res) => res.send(`/offers/${req.params.id}`));

module.exports = offersRouter;
