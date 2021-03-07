'use strict';

const express = require(`express`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const {getLogger} = require(`../logger`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);

const PORT = 8080;
const PUBLIC_DIR = `../../public`;
const UPLOAD_DIR = `upload`;


const app = express();
const logger = getLogger();

app.use(cookieParser());
app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(PORT, () => {
  logger.info(`Server start on ${PORT}`);
})
.on(`err`, (err) => {
  logger.error(`Server can't start. Error: ${err}`);
});
