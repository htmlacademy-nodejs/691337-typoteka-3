'use strict';

const {Sequelize, DataTypes, Model, Op} = require(`sequelize`);
const {DB_HOST, DB_USER, DB_NAME, DB_PASS, DB_DIALECT} = require(`./config`);
const getReader = require(`./models/reader`);
const getArticle = require(`./models/article`);
const getComment = require(`./models/comment`);
const getCategory = require(`./models/category`);
const getToken = require(`./models/token`);
const {getLogger} = require(`../logger`);

const logger = getLogger();

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASS,
    {
      host: DB_HOST,
      dialect: DB_DIALECT,
    }
);

const Models = {
  Reader: getReader(sequelize, DataTypes, Model),
  Article: getArticle(sequelize, DataTypes, Model),
  Comment: getComment(sequelize, DataTypes, Model),
  Category: getCategory(sequelize, DataTypes, Model),
  Token: getToken(sequelize, DataTypes, Model),
};

Models.Reader.hasMany(Models.Comment, {
  as: `comments`,
  foreignKey: `readerId`,
});

Models.Article.hasMany(Models.Comment, {
  as: `comments`,
  foreignKey: `articleId`,
});

Models.Comment.belongsTo(Models.Reader, {
  as: `reader`,
  foreignKey: `readerId`,
});

Models.Comment.belongsTo(Models.Article, {
  as: `article`,
  foreignKey: `articleId`,
});

Models.Article.belongsToMany(Models.Category, {
  through: `article_category`,
  as: `categories`,
  foreignKey: `articleId`,
  timestamps: false,
  paranoid: false,
});

Models.Category.belongsToMany(Models.Article, {
  through: `article_category`,
  as: `articles`,
  foreignKey: `categoryId`,
});

const connectDb = async () => {
  try {
    logger.info(`Starting connection to database ${DB_NAME}`);
    await sequelize.authenticate();
    logger.info(`Database connection successful`);
  } catch (err) {
    logger.error(`Connection error: ${err}`);
  }
};

const initDb = async (readers, articles, comments, categories, fn) => {
  try {
    await sequelize.sync({force: true});
    logger.info(`Database structure created successful`);

    await Models.Reader.bulkCreate(readers);
    await Models.Article.bulkCreate(articles);
    await Models.Comment.bulkCreate(comments);
    await Models.Category.bulkCreate(categories);

    const allArticles = await Models.Article.findAll({raw: true});
    const getRandomCategories = async (array) => {
      const randomCategories = await Models.Category.findAll({
        where: {
          'id': {
            [Op.in]: array
          }
        }
      });
      return randomCategories;
    };

    for (let i = 1; i <= allArticles.length; i += 1) {
      const currentArticle = await Models.Article.findByPk(i);
      await currentArticle.addCategories(await getRandomCategories(fn(categories)));
    }

  } catch (err) {
    logger.error(`Tables not created: ${err}`);
  }
};

module.exports = {
  Models,
  connectDb,
  initDb,
  sequelize,
};
