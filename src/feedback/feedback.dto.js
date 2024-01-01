const Joi = require("joi");

const feedbackSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  message: Joi.string().required(),
});

module.exports = feedbackSchema;
