'use strict';

const {Sequelize, DataTypes, Model, Op} = require(`sequelize`);
const {DB_HOST, DB_USER, DB_NAME, DB_PASS, DB_DIALECT} = require(`./config`);
const getReader = require(`./models/reader`);
const getArticle = require(`./models/article`);
const getComment = require(`./models/comment`);
const getCategory = require(`./models/category`);
const {getLogger} = require(`../src/logger`);

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

/*
const Reader = getReader(sequelize, DataTypes, Model);
const Article = getArticle(sequelize, DataTypes, Model);
const Comment = getComment(sequelize, DataTypes, Model);
const Category = getCategory(sequelize, DataTypes, Model);
*/

const Models = {
  Reader: getReader(sequelize, DataTypes, Model),
  Article: getArticle(sequelize, DataTypes, Model),
  Comment: getComment(sequelize, DataTypes, Model),
  Category: getCategory(sequelize, DataTypes, Model),
};

Models.Reader.hasMany(Models.Comment, {
  as: `comments`,
  foreignKey: `reader_id`,
});

Models.Article.hasMany(Models.Comment, {
  as: `comments`,
  foreignKey: `article_id`,
});

Models.Comment.belongsTo(Models.Reader, {
  as: `reader`,
  foreignKey: `reader_id`,
});

Models.Comment.belongsTo(Models.Article, {
  as: `article`,
  foreignKey: `article_id`,
});

Models.Article.belongsToMany(Models.Category, {
  through: `article_category`,
  as: `categories`,
  foreignKey: `article_id`,
  timestamps: false,
  paranoid: false,
});

Models.Category.belongsToMany(Models.Article, {
  through: `article_category`,
  as: `articles`,
  foreignKey: `category_id`,
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
          'category_id': {
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
