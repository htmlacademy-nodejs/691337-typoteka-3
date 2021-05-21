'use strict';
const express = require(`express`);
const controller = require(`../controllers/categories`);
const paramsValidator = require(`../validation/validator-params`);
const checkValidity = require(`../validation/validator`);
const categorySchema = require(`../validation/schemes/category-schema`);

const categoriesRouter = new express.Router();

categoriesRouter.get(`/`, controller.getCategories);
categoriesRouter.post(`/`, checkValidity(categorySchema), controller.addCategory);
categoriesRouter.put(`/:categoryId`, paramsValidator(`categoryId`), checkValidity(categorySchema), controller.updateCategory);
categoriesRouter.delete(`/:categoryId`, paramsValidator(`categoryId`), controller.removeCategory);

module.exports = categoriesRouter;
