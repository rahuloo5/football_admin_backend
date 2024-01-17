const Joi = require("joi");

const ContentSchema = Joi.object({
  description: Joi.string().required(),
  image: Joi.string().required(),
});
module.exports = ContentSchema;
