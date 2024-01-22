const Joi = require("joi");

exports.register = Joi.object({
  number: Joi.string().required().min(10).max(10),
});

const userValidator = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email_id: Joi.string().email(),
  number: Joi.string().required(),
  countryCode: Joi.string(),
});

module.exports = userValidator;
