'use strict';

const Joi = require(`joi`);
const {RegisterMessage} = require(`../../../constants`);

module.exports = Joi.object({
  firstname: Joi.string()
    .pattern(/^[a-zA-Zа-яА-Я]{1,50}$/)
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'string.pattern.base': RegisterMessage.WRONG_READER_FIRSTNAME
    }),
  lastname: Joi.string()
    .pattern(/^[a-zA-Zа-яА-Я]{1,50}$/)
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'string.pattern.base': RegisterMessage.WRONG_READER_LASTNAME,
      'string.empty': RegisterMessage.LASTNAME_EMPTY_VALUE
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3
    })
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'string.email': RegisterMessage.WRONG_EMAIL
    }),
  pass: Joi.string()
    .min(6)
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'string.min': RegisterMessage.MIN_PASSWORD_LENGTH
    }),
  repeatPass: Joi.string()
    .valid(Joi.ref(`pass`))
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'any.only': RegisterMessage.PASSWORDS_NOT_EQUAL
    }),
  avatar: Joi.string()
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
      'string.empty': RegisterMessage.AVATAR_EMPTY_VALUE
    })
});
