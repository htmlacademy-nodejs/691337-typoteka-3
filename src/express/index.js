'use strict';

const express = require(`express`);
const {getLogger} = require(`../logger`);
const mainRouter = require(`./routes/main`);
//const registerRouter = require(`./routes/register`);
//const loginRouter = require(`./routes/login`);
const myRouter = require(`./routes/my`);
//const searchRouter = require(`./routes/search`);
const articlesRouter = require(`./routes/articles`);

const PORT = 8080;
const PUBLIC_DIR = `markup`;

const app = express();
const logger = getLogger();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.use(express.static(PUBLIC_DIR));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);

app.listen(PORT, () => {
  logger.info(`Server start on ${PORT}`);
})
.on(`err`, (err) => {
  logger.error(`Server can't start. Error: ${err}`);
});
