const Joi = require("joi");

const SchemaValidation = Joi.object({
  searchText: Joi.string().required(),
  count: Joi.number().default(0),
});

module.exports = SchemaValidation;
