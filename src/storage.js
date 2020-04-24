'use strict';

const nanoid = require(`nanoid`);

const INDEX_NOT_FOUND = -1;
const ID_LENGTH = 6;

module.exports.storage = {
  getCategories: (data) => {
    return data.map((it) => it.category)
    .flat()
    .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, []);
  },
  getAllArticles: (data) => {
    return data.map((it) => ({id: it.id, title: it.title}));
  },
  getArticleById: (data, articleId) => {
    const index = data.map((it) => it.id).indexOf(articleId);
    return index !== INDEX_NOT_FOUND ? data[index] : undefined;
  },
  getComments: (data, articleId) => {
    const index = data.map((it) => it.id).indexOf(articleId);
    return index !== INDEX_NOT_FOUND ? data[index].comments : undefined;
  },
  removeArticleById: (data, articleId) => {
    const index = data.map((it) => it.id).indexOf(articleId);
    return index !== INDEX_NOT_FOUND ? data.splice(index, 1) : undefined;
  },
  removeCommentById: (data, articleId, commentId) => {
    const index = data.map((it) => it.id).indexOf(articleId);

    if (index === INDEX_NOT_FOUND) {
      return undefined;
    }

    const commentIndex = data[index].comments.map((it) => it.id).indexOf(commentId);
    return commentIndex !== INDEX_NOT_FOUND ?
      data[index].comments.splice(commentIndex, 1) : undefined;
  },
  isArticleValid: (article) => {
    const properties = [`title`, `createdDate`, `announce`, `fullText`, `category`];
    return properties.every((it) => article.hasOwnProperty(it));
  },
  updateArticle: (data, articleId, newData) => {
    const index = data.map((it) => it.id).indexOf(articleId);

    if (index === INDEX_NOT_FOUND || !newData) {
      return undefined;
    }

    const {title, createdDate, announce, fullText, category} = newData;
    const updatedArticle = {
      title,
      createdDate,
      announce,
      fullText,
      category,
    };
    data[index] = {...data[index], ...updatedArticle};
    return data[index];
  },
  isCommentValid: (comment) => {
    return comment && comment.text !== `` ? true : false;
  },
  addNewComment: (data, articleId, comment) => {
    const index = data.map((it) => it.id).indexOf(articleId);

    if (index === INDEX_NOT_FOUND || !comment) {
      return undefined;
    }

    const {text} = comment;
    const newComment = {
      id: nanoid(ID_LENGTH),
      text,
    };
    data[index].comments.unshift(newComment);
    return newComment;
  },
  addNewArticle: (data, articleData) => {

    if (!articleData) {
      return undefined;
    }

    const {title, createdDate, announce, fullText, category} = articleData;
    const newArticle = {
      id: nanoid(ID_LENGTH),
      title,
      createdDate,
      announce,
      fullText,
      category,
      comments: [],
    };
    data.unshift(newArticle);
    return newArticle;
  },
  getMatchedArticles: (data, searchString) => {
    return data.filter((it) => it.title.includes(searchString));
  },
};
