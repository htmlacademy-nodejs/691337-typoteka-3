'use strict';

const express = require(`express`);

const registerRouter = require(`./routes/register`);
const loginRouter = require(`./routes/login`);
const myRouter = require(`./routes/my`);
const searchRouter = require(`./routes/search`);
const articlesRouter = require(`./routes/articles`);

const PORT = 8080;
const PUBLIC_DIR = `markup`;
const app = express();

const Routes = {
  register: registerRouter,
  login: loginRouter,
  my: myRouter,
  search: searchRouter,
  articles: articlesRouter,
};

app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);
app.use(express.static(PUBLIC_DIR));

Object.entries(Routes).forEach(([key, value]) => app.use(`/${key}`, value));

app.get(`/`, (req, res) => res.render(`main`));

app.listen(PORT, () => console.log(`Server is on ${PORT}`));