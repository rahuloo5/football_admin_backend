const Joi = require("joi");

const ContentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
});
module.exports = ContentSchema;
