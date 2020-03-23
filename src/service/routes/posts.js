'use strict';
const express = require(`express`);
const fs = require(`fs`).promises;

const FILENAME = `mocks.json`;

const postsRouter = new express.Router();
// postsRouter.use(express.json());

const onUserRequest = async (req, res) => {
  try {
    const content = await fs.readFile(FILENAME, `utf-8`);
    return res.json(content.length > 0 ? content : `[]`);
  } catch (err) {
    return res.json(`[]`);
  }
};

postsRouter.get(`/`, onUserRequest);

module.exports = postsRouter;
