'use strict';

const Joi = require(`joi`);
const {ArticleMessage} = require(`../../../constants`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'any.required': ArticleMessage.REQUIRED_FIELD,
      'string.min': ArticleMessage.MIN_TITLE_LENGTH,
      'string.max': ArticleMessage.MAX_TITLE_LENGTH
    }),
  picture: Joi.string(),
  createdDate: Joi.string()
    .isoDate()
    .required(),
  category: Joi.array()
    .min(1)
    .items(Joi.string())
    .messages({
      'array.min': ArticleMessage.CATEGORY_REQUIRED
    }),
  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'any.required': ArticleMessage.REQUIRED_FIELD,
      'string.empty': ArticleMessage.MIN_ANNOUNCE_LENGTH,
      'string.min': ArticleMessage.MIN_ANNOUNCE_LENGTH,
      'string.max': ArticleMessage.MAX_ANNOUNCE_LENGTH
    }),
  fullText: Joi.string()
    .allow(``)
    .max(1000)
    .messages({
      'string.max': ArticleMessage.MAX_TEXT_LENGTH
    })
});
