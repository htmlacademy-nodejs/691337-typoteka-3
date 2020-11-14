'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required(),
  createdDate: Joi.string()
    .isoDate(),
  category: Joi.array()
    .items(Joi.string()
    .required()),
  announce: Joi.string()
    .min(30)
    .max(250)
    .required(),
  fullText: Joi.string()
    .max(1000)
});
