const Joi = require("joi");

const smtpValidationSchema = Joi.object({
  comment: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = smtpValidationSchema;
