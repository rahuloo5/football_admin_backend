const Joi = require("joi");

const commentValidationSchema = Joi.object({
  comment: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = commentValidationSchema;
