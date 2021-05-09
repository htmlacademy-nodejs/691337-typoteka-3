'use strict';

const Joi = require(`joi`);
const {CommentMessage} = require(`../../../constants`);

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.empty': CommentMessage.EMPTY_COMMENT,
      'string.min': CommentMessage.MIN_COMMENT_LENGTH
    }),
  readerId: Joi.string()
    .min(1)
    .required(),
});
