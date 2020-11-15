'use strict';

const {Op} = require(`sequelize`);
const {Models} = require(`../service/db`);

const ARTICLES_PER_PAGE = 8;
const START_PAGE = 1;
const PAGES_AMOUNT_MAX = 5;

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
  [`created_date`, `createdDate`],
  [`comment_text`, `text`]
];

const categoryAttributes = [
  [`category_id`, `id`],
  [`category_title`, `title`]
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

const getPagesToView = (pagesAmount, currentPage) => {
  const offset = currentPage > PAGES_AMOUNT_MAX ? currentPage - PAGES_AMOUNT_MAX : 0;
  const firstIndex = START_PAGE + offset;
  const lastIndex = pagesAmount < PAGES_AMOUNT_MAX ? pagesAmount : PAGES_AMOUNT_MAX + offset;
  return {
    firstIndex,
    lastIndex,
    previous: offset > 0,
    next: pagesAmount > PAGES_AMOUNT_MAX && pagesAmount > lastIndex
  };
};

module.exports.storage = {
  getCategories: async () => {
    const rawCategories = await Models.Category.findAll({
      attributes: categoryAttributes
    });
    const categories = await Promise.all(Array(rawCategories.length)
    .fill({})
    .map(async (it, index) => {
      const {id, title} = rawCategories[index].dataValues;
      const currentCategory = await Models.Category.findByPk(id);
      const articlesAmount = await currentCategory.countArticles();
      return {id, title, articlesAmount};
    }));
    return categories.filter((it) => it.articlesAmount > 0);
  },

  getArticles: async (page) => {
    const articlesAmount = await Models.Article.count();
    const pagesAmount = Math.ceil(articlesAmount / ARTICLES_PER_PAGE);
    const currentPage = parseInt(page, 10) || START_PAGE;

    const rawArticles = await Models.Article.findAll({
      attributes: articleAttributes,
      include: tableJoinTemplate,
      order: [[`created_date`, `DESC`]],
      offset: ARTICLES_PER_PAGE * (currentPage - START_PAGE),
      limit: ARTICLES_PER_PAGE
    });
    const articles = rawArticles.map((it) => normalizeArticleData(it));
    const pagesToView = getPagesToView(pagesAmount, currentPage);
    return {articles, articlesAmount, pagesAmount, currentPage, pagesToView};
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

  getArticlesByCategoryId: async (categoryId, page) => {
    const category = await Models.Category.findByPk(categoryId, {
      attributes: [`category_id`]
    });
    const articlesAmount = await category.countArticles();
    const pagesAmount = Math.ceil(articlesAmount / ARTICLES_PER_PAGE);
    const currentPage = parseInt(page, 10) || START_PAGE;
    const rawArticles = await category.getArticles({
      attributes: articleAttributes,
      include: tableJoinTemplate,
      offset: ARTICLES_PER_PAGE * (currentPage - START_PAGE),
      limit: ARTICLES_PER_PAGE
    });
    const articles = rawArticles.map((it) => normalizeArticleData(it));
    const categoryData = await Models.Category.findByPk(categoryId, {
      attributes: categoryAttributes
    });
    const pagesToView = getPagesToView(pagesAmount, currentPage);
    return {articles, articlesAmount, pagesAmount, currentPage, categoryData, pagesToView};
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
