'use strict';

const nanoid = require(`nanoid`);
const mocks = require(`../mocks`);

const INDEX_NOT_FOUND = -1;
const ID_LENGTH = 6;

module.exports.storage = {
  getCategories: () => {
    return mocks.map((it) => it.category)
    .flat()
    .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, []);
  },
  getAllArticles: () => {
    return mocks.map((it) => ({id: it.id, title: it.title}));
  },
  getArticleById: (articleId) => {
    const index = mocks.map((it) => it.id).indexOf(articleId);
    return index !== INDEX_NOT_FOUND ? mocks[index] : undefined;
  },
  getComments: (articleId) => {
    const index = mocks.map((it) => it.id).indexOf(articleId);
    return index !== INDEX_NOT_FOUND ? mocks[index].comments : undefined;
  },
  removeArticleById: (articleId) => {
    const index = mocks.map((it) => it.id).indexOf(articleId);
    return index !== INDEX_NOT_FOUND ? mocks.splice(index, 1) : undefined;
  },
  removeCommentById: (articleId, commentId) => {
    const index = mocks.map((it) => it.id).indexOf(articleId);

    if (index === INDEX_NOT_FOUND) {
      return undefined;
    }

    const commentIndex = mocks[index].comments.map((it) => it.id).indexOf(commentId);
    return commentIndex !== INDEX_NOT_FOUND ?
      mocks[index].comments.splice(commentIndex, 1) : undefined;
  },
  isValidArticle: (article) => {
    const properties = [`title`, `createdDate`, `announce`, `fullText`, `category`];
    return properties.every((it) => article.hasOwnProperty(it));
  },
  updateArticle: (articleId, newData) => {
    const index = mocks.map((it) => it.id).indexOf(articleId);

    if (index === INDEX_NOT_FOUND) {
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
    mocks[index] = {...mocks[index], ...updatedArticle};
    return mocks[index];
  },
  isCommentValid: (comment) => {
    return comment && comment.text !== `` ? true : false;
  },
  addNewComment: (articleId, comment) => {
    const index = mocks.map((it) => it.id).indexOf(articleId);

    if (index === INDEX_NOT_FOUND) {
      return undefined;
    }

    const {text} = comment;
    const newComment = {
      id: nanoid(ID_LENGTH),
      text,
    };
    mocks[index].comments.unshift(newComment);
    return newComment;
  },
  addNewArticle: (articleData) => {
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
    mocks.unshift(newArticle);
    return newArticle;
  },
  getMatchedArticles: (searchString) => {
    return mocks.filter((it) => it.title.includes(searchString));
  },
};
