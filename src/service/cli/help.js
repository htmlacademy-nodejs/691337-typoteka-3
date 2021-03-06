'use strict';

const {getLogger} = require(`../../logger`);

const logger = getLogger();

module.exports = {
  name: `--help`,
  run() {
    const info = `
    Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    server <command>

    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>:   формирует файл mocks.json
    `;
    logger.info(info);
  },
};
