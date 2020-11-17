'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required(),
  picture: Joi.string(),
  createdDate: Joi.string()
    .isoDate()
    .required(),
  category: Joi.array()
    .items(Joi.string()
    .required()),
  announce: Joi.string()
    .min(30)
    .max(250)
    .required(),
  fullText: Joi.string()
    .min(0)
    .max(1000)
});
