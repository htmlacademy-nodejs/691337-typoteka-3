'use strict';

const {Op} = require(`sequelize`);
const {Models} = require(`../service/db`);

const articleAttributes = [
  [`article_id`, `id`],
  [`article_title`, `title`],
  [`created_date`, `createdDate`],
  [`picture_name`, `picture`],
  [`full_text`, `fullText`],
  `announce`
];

const commentAttributes = [
  [`comment_id`, `id`],
  [`comment_text`, `text`]
];

const tableJoinTemplate = [
  {
    model: Models.Category,
    as: `categories`,
    attributes: [`category_title`],
    through: {
      attributes: []
    }
  },
  {
    model: Models.Comment,
    as: `comments`,
    attributes: commentAttributes
  }
];

const getCategoryTitle = (categories) => {
  return categories.map((it) => it.category_title);
};
const normalizeArticleData = (article) => {
  const {id, title, createdDate, picture, announce, fullText, categories, comments} = article.dataValues;
  return {
    id,
    title,
    createdDate,
    picture,
    announce,
    fullText,
    category: getCategoryTitle(categories),
    comments,
  };
};

module.exports.storage = {
  getCategories: async () => {
    const categories = await Models.Category.findAll({
      attributes: [`category_title`]
    });
    return categories.map((it) => it.category_title);
  },

  getAllArticles: async () => {
    const allArticles = await Models.Article.findAll({
      attributes: articleAttributes,
      include: tableJoinTemplate
    });
    return allArticles.map((it) => normalizeArticleData(it));
  },

  getArticleById: async (articleId) => {
    const article = await Models.Article.findByPk(articleId, {
      attributes: articleAttributes,
      include: tableJoinTemplate
    });
    if (article === null) {
      return undefined;
    }
    return normalizeArticleData(article);
  },

  getComments: async (articleId) => {
    const article = await Models.Article.findByPk(articleId, {
      attributes: articleAttributes,
      include: tableJoinTemplate
    });
    if (article === null) {
      return undefined;
    }
    return article.comments;
  },

  removeArticleById: (articleId) => {
    return Models.Article.destroy({where: {'article_id': articleId}});
  },

  removeCommentById: (articleId, commentId) => {
    return Models.Comment.destroy({
      where: {[Op.and]: [{'article_id': articleId}, {'comment_id': commentId}]}
    });
  },

  isArticleValid: (article) => {
    const properties = [`title`, `createdDate`, `announce`, `fullText`, `category`];
    return properties.every((it) => article.hasOwnProperty(it));
  },

  updateArticle: async (articleId, newData) => {
    const {title, createdDate, announce, fullText, category, picture} = newData;
    const updatedArticle = {
      'article_title': title,
      'created_date': createdDate,
      announce,
      'full_text': fullText,
      'picture_name': picture,
    };

    const currentArticle = await Models.Article.findByPk(articleId);
    if (currentArticle === null) {
      return undefined;
    }
    const currentCategories = await currentArticle.getCategories();
    currentCategories.forEach(async (it) => await currentArticle.removeCategories(it));
    const categories = await Models.Category.findAll({
      where: {'category_title': {[Op.in]: [category].flat()}}
    });

    await currentArticle.update(updatedArticle, {});
    await currentArticle.addCategories(categories);
    return currentArticle;
  },

  isCommentValid: (comment) => {
    return comment && comment.text !== `` ? true : false;
  },

  addNewComment: async (articleId, comment) => {
    const article = await Models.Article.findByPk(articleId);
    if (article === null) {
      return undefined;
    }
    const {text} = comment;
    const newComment = await Models.Comment.create({
      'comment_text': text,
      'created_date': Date.now(),
      'article_id': articleId,
    });
    return newComment;
  },

  addNewArticle: async (articleData) => {
    if (!articleData) {
      return undefined;
    }
    const {title, createdDate, announce, picture, fullText, category} = articleData;
    const newArticle = await Models.Article.create({
      'article_title': title,
      'created_date': createdDate,
      'picture_name': picture,
      'full_text': fullText,
      announce,
    });

    const categories = await Models.Category.findAll({
      where: {'category_title': {[Op.in]: [category].flat()}}
    });

    await newArticle.addCategories(categories);
    return newArticle;
  },

  getMatchedArticles: (searchString) => {
    return Models.Article.findAll({
      attributes: articleAttributes,
      where: {'article_title': {[Op.substring]: searchString}}
    });
  },
};
