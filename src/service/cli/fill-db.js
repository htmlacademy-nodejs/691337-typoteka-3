'use strict';

const fs = require(`fs`).promises;
const nanoid = require(`nanoid`);
const {getLogger} = require(`../../logger`);
const {shuffle, getRandomInt} = require(`../../utils`);
const {sequelize, initDb} = require(`../../../service/db`);

const FILE_PATH_TITLES = `./data/titles.txt`;
const FILE_PATH_CATEGORIES = `./data/categories.txt`;
const FILE_PATH_SENTENCES = `./data/sentences.txt`;
const FILE_PATH_COMMENTS = `./data/comments.txt`;
const FILE_PATH_READERS = `./data/readers.txt`;
const FILE_PATH_PICTURES = `./data/pictures.txt`;

const DEFAULT_AMOUNT = 3;
const START_INDEX = 1;
const MAX_AMOUNT = 1000;
const MS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
const MONTHS_AMOUNT = 3;
const PASS_LENGTH = 6;

const logger = getLogger();

const DateRange = {
  min: Date.now() - MONTHS_AMOUNT * MS_IN_MONTH,
  max: Date.now(),
};

const AvatarRange = {
  min: 1,
  max: 5,
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

const getAvatarFileName = (num) => `avatar-${num}.png`;

const getRandomDate = () => new Date(getRandomInt(DateRange.min, DateRange.max))
  .toISOString().split(`T`)[0];

const getRandomComments = (comments) => Array(getRandomInt(2, 5)).fill(``)
  .map(() => comments[getRandomInt(0, comments.length - 1)]);

const getRandomCategories = (categories) => Array(getRandomInt(1, 3)).fill(``)
  .map(() => getRandomInt(START_INDEX, categories.length))
  .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, []);

const generateReadersData = (readers) => readers.map((it) => {
  const [firstName, lastName, email] = it.split(`, `);
  const pass = nanoid(PASS_LENGTH);
  const avatar = getAvatarFileName(getRandomInt(AvatarRange.min, AvatarRange.max));
  return {
    'first_name': firstName,
    'last_name': lastName,
    'email': email,
    'pass': pass,
    'avatar_name': avatar,
  };
});

const generateArticlesData = (amount, titles, sentences, pictures) => Array(amount).fill(``).map(() => ({
  'article_title': titles[getRandomInt(0, titles.length - 1)],
  'created_date': getRandomDate(),
  'announce': Array(getRandomInt(1, 5)).fill(``)
    .map(() => sentences[getRandomInt(0, sentences.length - 1)])
    .reduce((acc, el) => !acc.includes(el) ? [...acc, el] : acc, [])
    .join(` `),
  'picture_name': pictures[getRandomInt(0, pictures.length - 1)],
  'full_text': shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
}));

const generateCommentsData = (amount, comments, readers) => Array(amount).fill(START_INDEX)
  .map((it, index) => {
    const articleId = it + index;
    const articleComments = getRandomComments(comments);

    return articleComments
      .map((el) => ({
        'comment_text': el,
        'created_date': getRandomDate(),
        'article_id': articleId,
        'reader_id': getRandomInt(START_INDEX, readers.length),
      }));
  })
  .flat();

const generateCategoriesData = (categories) => categories.map((it) => {
  return {
    'category_title': it
  };
});

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [titles, categories, sentences, comments, readers, pictures] = await Promise.all([
      readContent(FILE_PATH_TITLES),
      readContent(FILE_PATH_CATEGORIES),
      readContent(FILE_PATH_SENTENCES),
      readContent(FILE_PATH_COMMENTS),
      readContent(FILE_PATH_READERS),
      readContent(FILE_PATH_PICTURES),
    ]);

    const [amount] = args;
    const articleAmount = Number.parseInt(amount, 10) || DEFAULT_AMOUNT;

    if (articleAmount > MAX_AMOUNT) {
      logger.info(`Не больше 1000 публикаций`);
      return;
    }

    const readersData = generateReadersData(readers);
    const articlesData = generateArticlesData(articleAmount, titles, sentences, pictures);
    const commentsData = generateCommentsData(articleAmount, comments, readers);
    const categoriesData = generateCategoriesData(categories);

    await initDb(readersData, articlesData, commentsData, categoriesData, getRandomCategories);
    await sequelize.close();
  },
};
