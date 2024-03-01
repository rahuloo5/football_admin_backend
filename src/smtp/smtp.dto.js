const Joi = require("joi");

const smtpSchema = Joi.object({
  slug: Joi.string(),
  host: Joi.string().required(),
  port: Joi.string().required(),
  user: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = smtpSchema;
