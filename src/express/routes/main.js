'use strict';

const express = require(`express`);
const multer = require(`multer`);
const csrf = require(`csurf`);
const path = require(`path`);
const nanoid = require(`nanoid`);
const controller = require(`../controllers/main`);
const {authAdmin} = require(`../jwt-auth`);
const mainRouter = new express.Router();

const csrfProtection = csrf({cookie: true});

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
mainRouter.get(`/register`, csrfProtection, controller.getRegisterForm);
mainRouter.get(`/login`, csrfProtection, controller.getLoginForm);
mainRouter.post(`/register`, upload.single(`upload`), csrfProtection, controller.addNewReader);
mainRouter.post(`/login`, upload.any(), csrfProtection, controller.authenticateReader);
mainRouter.get(`/logout`, controller.logout);
mainRouter.get(`/categories`, authAdmin, (req, res) => res.render(`main/all-categories`));
mainRouter.get(`/search`, csrfProtection, controller.getMatchedArticles);

module.exports = mainRouter;
