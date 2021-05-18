'use strict';

const Joi = require(`joi`);
const {CategoryMessage} = require(`../../../constants`);

module.exports = Joi.object({
  title: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      'string.empty': CategoryMessage.MIN_TITLE_LENGTH,
      'string.min': CategoryMessage.MIN_TITLE_LENGTH,
      'string.max': CategoryMessage.MAX_TITLE_LENGTH
    })
});
