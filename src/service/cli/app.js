'use strict';
const express = require(`express`);
const articlesRouter = require(`../routes/articles`);
const categoriesRouter = require(`../routes/categories`);
const searchRouter = require(`../routes/search`);

const app = express();
app.use(express.json());
app.use(`/api/articles`, articlesRouter);
app.use(`/api/categories`, categoriesRouter);
app.use(`/api/search`, searchRouter);

module.exports = app;
