'use strict';

const express = require(`express`);

const registerRouter = require(`./routes/register`);
const loginRouter = require(`./routes/login`);
const myRouter = require(`./routes/my`);
const searchRouter = require(`./routes/search`);
const offersRouter = require(`./routes/offers`);

const PORT = 8080;
const app = express();

const Routes = {
  register: registerRouter,
  login: loginRouter,
  my: myRouter,
  search: searchRouter,
  offers: offersRouter,
};

Object.entries(Routes).forEach(([key, value]) => app.use(`/${key}`, value));

app.get(`/`, (req, res) => res.send(`/`));

app.listen(PORT, () => console.log(`Server is on ${PORT}`));
