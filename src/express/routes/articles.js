'use strict';

const express = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const nanoid = require(`nanoid`);
const controller = require(`../controllers/articles`);
const articlesRouter = new express.Router();

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

articlesRouter.get(`/category/:id`, controller.getArticlesByCategory);
articlesRouter.get(`/add`, controller.getNewArticleForm);
articlesRouter.post(`/add`, upload.single(`upload`), controller.addArticle);
articlesRouter.get(`/edit/:id`, controller.getArticleById);
articlesRouter.post(`/edit/:id`, upload.single(`upload`), controller.updateArticle);
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRouter;
