'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`../../logger`);
const {shuffle, getRandomInt} = require(`../../utils`);
const {sequelize, initDb} = require(`../../db-service/db`);

const FILE_PATH_TITLES = `./data/titles.txt`;
const FILE_PATH_CATEGORIES = `./data/categories.txt`;
const FILE_PATH_SENTENCES = `./data/sentences.txt`;
const FILE_PATH_COMMENTS = `./data/comments.txt`;
const FILE_PATH_PICTURES = `./data/pictures.txt`;

const DEFAULT_AMOUNT = 3;
const START_INDEX = 1;
const MAX_AMOUNT = 1000;
const MS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
const MONTHS_AMOUNT = 3;

const logger = getLogger();

const DateRange = {
  min: Date.now() - MONTHS_AMOUNT * MS_IN_MONTH,
  max: Date.now(),
};

const readContent = async (filepath) => {
  try {
    const content = await fs.readFile(filepath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const getRandomDate = () => new Date(getRandomInt(DateRange.min, DateRange.max))
  .toISOString().split(`T`)[0];

const getRandomComments = (comments) => Array(getRandomInt(2, 5)).fill(``)
  .map(() => comments[getRandomInt(0, comments.length - 1)]);

const getRandomCategories = (categories) => Array(getRandomInt(1, 3)).fill(``)
  .map(() => getRandomInt(START_INDEX, categories.length))
  .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, []);

const generateArticlesData = (amount, titles, sentences, pictures) => Array(amount).fill(``).map(() => ({
  'title': titles[getRandomInt(0, titles.length - 1)],
  'createdDate': getRandomDate(),
  'announce': Array(getRandomInt(1, 5)).fill(``)
    .map(() => sentences[getRandomInt(0, sentences.length - 1)])
    .reduce((acc, el) => !acc.includes(el) ? [...acc, el] : acc, [])
    .join(` `),
  'picture': pictures[getRandomInt(0, pictures.length - 1)],
  'fullText': shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
}));

const generateCommentsData = (amount, comments) => Array(amount).fill(START_INDEX)
  .map((it, index) => {
    const articleId = it + index;
    const articleComments = getRandomComments(comments);

    return articleComments
      .map((el) => ({
        'text': el,
        'createdDate': getRandomDate(),
        articleId
      }));
  })
  .flat();

const generateCategoriesData = (categories) => categories.map((it) => {
  return {
    'title': it
  };
});

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [titles, categories, sentences, comments, pictures] = await Promise.all([
      readContent(FILE_PATH_TITLES),
      readContent(FILE_PATH_CATEGORIES),
      readContent(FILE_PATH_SENTENCES),
      readContent(FILE_PATH_COMMENTS),
      readContent(FILE_PATH_PICTURES),
    ]);

    const [amount] = args;
    const articleAmount = Number.parseInt(amount, 10) || DEFAULT_AMOUNT;

    if (articleAmount > MAX_AMOUNT) {
      logger.info(`Не больше 1000 публикаций`);
      return;
    }

    const articlesData = generateArticlesData(articleAmount, titles, sentences, pictures);
    const commentsData = generateCommentsData(articleAmount, comments);
    const categoriesData = generateCategoriesData(categories);

    await initDb(articlesData, commentsData, categoriesData, getRandomCategories);
    await sequelize.close();
  },
};
