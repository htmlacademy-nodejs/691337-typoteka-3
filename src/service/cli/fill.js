'use strict';

const fs = require(`fs`).promises;
const nanoid = require(`nanoid`);
const {getLogger} = require(`../../logger`);
const {shuffle, getRandomInt} = require(`../../utils`);

const FILE_PATH_TITLES = `./data/titles.txt`;
const FILE_PATH_CATEGORIES = `./data/categories.txt`;
const FILE_PATH_SENTENCES = `./data/sentences.txt`;
const FILE_PATH_COMMENTS = `./data/comments.txt`;
const FILE_PATH_READERS = `./data/readers.txt`;

const DEFAULT_AMOUNT = 3;
const START_INDEX = 1;
const MAX_AMOUNT = 1000;
const FILE_NAME = `fill-db.sql`;
const MS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
const MONTHS_AMOUNT = 3;
const PASS_LENGTH = 6;

const logger = getLogger();

const DateRange = {
  min: Date.now() - MONTHS_AMOUNT * MS_IN_MONTH,
  max: Date.now(),
};

const PictureRange = {
  min: 1,
  max: 16,
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

const getImgFileName = (num) => num < 10 ? `item0${num}.jpg` : `item${num}.jpg`;

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
  const avatar = getImgFileName(getRandomInt(PictureRange.min, PictureRange.max));
  return `(DEFAULT, '${firstName}', '${lastName}', '${email}', '${pass}', '${avatar}')`;
});

const generateArticlesData = (amount, titles, sentences) => Array(amount).fill(``).map(() => {
  const title = titles[getRandomInt(0, titles.length - 1)];
  const createdDate = getRandomDate();
  const announce = Array(getRandomInt(1, 5)).fill(``)
    .map(() => sentences[getRandomInt(0, sentences.length - 1)])
    .reduce((acc, el) => !acc.includes(el) ? [...acc, el] : acc, [])
    .join(` `);
  const picture = getImgFileName(getRandomInt(PictureRange.min, PictureRange.max));
  const fullText = shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `);

  return `(DEFAULT, '${title}', '${createdDate}', '${announce}', '${picture}', '${fullText}')`;
});

const generateCommentsData = (amount, comments, readers) => Array(amount).fill(START_INDEX)
  .map((it, index) => {
    const articleId = it + index;
    const articleComments = getRandomComments(comments);

    return articleComments
      .map((el) => `(DEFAULT, '${el}', '${getRandomDate()}', ${articleId}, ${getRandomInt(START_INDEX, readers.length)})`);
  })
  .flat();

const generateCategoriesData = (categories) => categories.map((it) => {
  return `(DEFAULT, '${it}')`;
});

const generateArticlesCategoriesData = (amount, categories) => Array(amount).fill(START_INDEX)
  .map((it, index) => {
    const articleId = it + index;
    const articleCategories = getRandomCategories(categories);

    return articleCategories
      .map((el) => `(${articleId}, ${el})`);
  })
  .flat();

module.exports = {
  name: `--fill`,
  async run(args) {
    const [titles, categories, sentences, comments, readers] = await Promise.all([
      readContent(FILE_PATH_TITLES),
      readContent(FILE_PATH_CATEGORIES),
      readContent(FILE_PATH_SENTENCES),
      readContent(FILE_PATH_COMMENTS),
      readContent(FILE_PATH_READERS)
    ]);

    const [amount] = args;
    const articleAmount = Number.parseInt(amount, 10) || DEFAULT_AMOUNT;

    if (articleAmount > MAX_AMOUNT) {
      logger.info(`Не больше 1000 публикаций`);
      return;
    }

    const SQLTables = [
      {
        name: `readers`,
        data: generateReadersData(readers),
      },
      {
        name: `articles`,
        data: generateArticlesData(articleAmount, titles, sentences),
      },
      {
        name: `comments`,
        data: generateCommentsData(articleAmount, comments, readers),
      },
      {
        name: `categories`,
        data: generateCategoriesData(categories),
      },
      {
        name: `articles_categories`,
        data: generateArticlesCategoriesData(articleAmount, categories),
      },
    ];

    const content = SQLTables.map((it) => {
      return `
      --
      -- Data for table: ${it.name}; Type: TABLE DATA; Schema: public
      --
      INSERT INTO ${it.name} VALUES
      ${it.data.join(`,\n      `)};
    `;
    }).join(` `);

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  },
};
