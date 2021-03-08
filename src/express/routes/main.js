'use strict';

const express = require(`express`);
const mainRouter = new express.Router();
const multer = require(`multer`);
const path = require(`path`);
const nanoid = require(`nanoid`);
const controller = require(`../controllers/main`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const FileType = [`image/png`, `image/jpg`, `image/jpeg`];

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (FileType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

mainRouter.get(`/`, controller.getArticles);
//mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/register`, controller.getRegisterForm);
mainRouter.get(`/login`, controller.getLoginForm);
mainRouter.post(`/register`, upload.single(`upload`), controller.addNewReader);
mainRouter.post(`/login`, upload.any(), controller.authenticateReader);
mainRouter.get(`/logout`, controller.logout);
mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`));
mainRouter.get(`/search`, controller.getMatchedArticles);

module.exports = mainRouter;
