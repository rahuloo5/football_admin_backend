const Joi = require("joi");

const privacySchema = Joi.object({
  content: Joi.string().required(),
});

module.exports = privacySchema;
