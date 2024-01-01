const Joi = require("joi");

const atricleSchema = Joi.object({
  Images: Joi.string().required(),
  short_description: Joi.string().required(),
  long_description: Joi.string().required(),
});

module.exports = atricleSchema;
