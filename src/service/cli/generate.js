'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const nanoid = require(`nanoid`);
const {shuffle, getRandomInt} = require(`../../utils`);

const FILE_PATH_TITLES = `./data/titles.txt`;
const FILE_PATH_CATEGORIES = `./data/categories.txt`;
const FILE_PATH_SENTENCES = `./data/sentences.txt`;
const FILE_PATH_COMMENTS = `./data/comments.txt`;

const DEFAULT_AMOUNT = 1;
const MAX_AMOUNT = 1000;
const FILE_NAME = `mocks.json`;
const MS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
const MONTHS_AMOUNT = 3;
const ID_LENGTH = 6;


const DateRange = {
  min: Date.now() - MONTHS_AMOUNT * MS_IN_MONTH,
  max: Date.now(),
};

const readContent = async (filepath) => {
  try {
    const content = await fs.readFile(filepath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateArticles = (amount, titles, categories, sentences, comments) => Array(amount).fill({}).map(() => ({
  id: nanoid(ID_LENGTH),
  title: titles[getRandomInt(0, titles.length - 1)],
  createdDate: new Date(getRandomInt(DateRange.min, DateRange.max)),
  announce: Array(getRandomInt(1, 5)).fill(``)
      .map(() => sentences[getRandomInt(0, sentences.length - 1)])
      .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, [])
      .join(` `),
  fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
  category: Array(getRandomInt(1, 3)).fill(``)
      .map(() => categories[getRandomInt(0, categories.length - 1)])
      .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, []),
  comments: Array(getRandomInt(1, 5)).fill({}).map(() => ({
    id: nanoid(ID_LENGTH),
    text: comments[getRandomInt(0, comments.length - 1)],
  })),
}));

module.exports = {
  name: `--generate`,
  async run(args) {
    const [titles, categories, sentences, comments] = await Promise.all([
      readContent(FILE_PATH_TITLES),
      readContent(FILE_PATH_CATEGORIES),
      readContent(FILE_PATH_SENTENCES),
      readContent(FILE_PATH_COMMENTS),
    ]);

    const [amount] = args;
    const articleAmount = Number.parseInt(amount, 10) || DEFAULT_AMOUNT;

    if (articleAmount > MAX_AMOUNT) {
      console.log(chalk.red(`Не больше 1000 публикаций`));
      return;
    }

    const content = JSON.stringify(generateArticles(articleAmount, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
