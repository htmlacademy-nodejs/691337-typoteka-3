'use strict';
const {getData} = require(`../../utils`);
const {URL} = require(`../../constants`);


module.exports.getArticles = async (req, res) => {
  try {
    const articles = await getData(`${URL}/articles`);
    console.log(articles);
    return res.render(`main`);
  } catch (err) {
    return console.log(err);
  }
};
