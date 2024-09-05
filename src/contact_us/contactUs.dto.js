const Joi = require("joi");

const privacySchema = Joi.object({
  subject: Joi.string().required(),
  comments: Joi.string().required(),
});

module.exports = privacySchema;
