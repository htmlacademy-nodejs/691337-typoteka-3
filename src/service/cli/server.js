'use strict';
const express = require(`express`);
const chalk = require(`chalk`);
const postsRouter = require(`../routes/posts`);

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());
app.use(`/posts`, postsRouter);

module.exports = {
  name: `--server`,
  async run(args) {

    const [userPort] = args;
    const port = Number.parseInt(userPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.log(chalk.green(`Ожидаю соединений на ${port}`));
    })
    .on(`err`, (err) => {
      console.error(chalk.red(`Ошибка при создании сервера, ${err}`));
    });
  },
};
