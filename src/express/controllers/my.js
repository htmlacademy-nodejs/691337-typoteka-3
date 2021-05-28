'use strict';
const axios = require(`axios`);
const {getData, renderError, changeDateView, changeDateViewOnlyDate} = require(`../../utils`);
const {URL} = require(`../../constants`);

const getArticleTitle = (articles, id) => {
  const currentArticle = articles.filter((it) => it.id === id);
  return currentArticle[0].title;
};

module.exports.getArticles = async (req, res) => {
  try {
    const data = await getData(`${URL}/articles`);
    data.articles.forEach((it) => {
      it.createdDate = changeDateViewOnlyDate(it.createdDate);
    });
    return res.render(`articles/my`, {
      articles: data.articles,
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const data = await getData(`${URL}/articles`);
    const articles = data.articles;
    const comments = articles
    .map((it) => it.comments)
    .flat()
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    comments.forEach((it) => {
      it.createdDate = changeDateView(it.createdDate);
      it.articleTitle = getArticleTitle(articles, it.articleId);
    });

    return res.render(`articles/comments`, {
      comments,
      csrf: req.csrfToken()
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    await axios.delete(`${URL}/articles/${req.params.articleId}/comments/${req.params.commentId}`);
    return res.redirect(`/my/comments`);
  } catch (err) {
    return renderError(err.response.status, res);
  }
};
