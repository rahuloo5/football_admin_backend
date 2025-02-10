const Joi = require("joi");

const SchemaValidation = Joi.object({
  count: Joi.number().default(0),
});

module.exports = SchemaValidation;
