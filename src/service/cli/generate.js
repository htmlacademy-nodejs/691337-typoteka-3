'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {shuffle, getRandomInt} = require(`../../utils`);

const DEFAULT_AMOUNT = 1;
const MAX_AMOUNT = 1000;
const FILE_NAME = `mocks.json`;
const MS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;
const MONTHS_AMOUNT = 3;


const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const TEXT = `
Ёлки — это не просто красивое дерево. Это прочная древесина.
Первая большая ёлка была установлена только в 1938 году.
Вы можете достичь всего. Стоит только немного постараться и запастись книгами.
Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.
Золотое сечение — соотношение двух величин, гармоническая пропорция.
Собрать камни бесконечности легко, если вы прирожденный герой.
Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.
Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.
Программировать не настолько сложно, как об этом говорят.
Простые ежедневные упражнения помогут достичь успеха.
Это один из лучших рок-музыкантов.
Он написал больше 30 хитов.
Из под его пера вышло 8 платиновых альбомов.
Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.
Рок-музыка всегда ассоциировалась с протестами.
Так ли это на самом деле? Достичь успеха помогут ежедневные повторения.
Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.
Как начать действовать? Для начала просто соберитесь.
Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.
Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.
`;

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const Sentences = TEXT.split(`.`)
.map((it) => it.startsWith(`\n`) || it.startsWith(``) ? it.slice(1) : it)
.filter((it) => it.length > 0);

const DateRange = {
  min: Date.now() - MONTHS_AMOUNT * MS_IN_MONTH,
  max: Date.now(),
};

const createRandomArticle = () => {

  const article = {
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createdDate: new Date(getRandomInt(DateRange.min, DateRange.max)),
    announce: Array(getRandomInt(1, 5)).fill(``)
      .map(() => Sentences[getRandomInt(0, Sentences.length - 1)]).join(`. `),
    fullText: shuffle(Sentences).slice(0, getRandomInt(0, Sentences.length - 1)).join(`. `),
    category: Array(getRandomInt(1, 3)).fill(``)
      .map(() => CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)])
      .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, []),
  };

  return article;
};

const generateArticles = (amount) => Array(amount).fill({}).map(() => createRandomArticle());

module.exports = {
  name: `--generate`,
  async run(args) {
    const [amount] = args;
    const articleAmount = Number.parseInt(amount, 10) || DEFAULT_AMOUNT;

    if (articleAmount > MAX_AMOUNT) {
      console.log(chalk.red(`Не больше 1000 публикаций`));
      return;
    }

    const content = JSON.stringify(generateArticles(articleAmount));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
