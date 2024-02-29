const Joi = require("joi");

const contentValidationSchema = Joi.object({
  description: Joi.string().required(),
  image: Joi.string(),
});

module.exports = { contentValidationSchema };
