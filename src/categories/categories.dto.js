const Joi = require("joi");

const CategoriesSchema = Joi.object({
  name: Joi.string().required(),
  sub_categorie: Joi.string().required(),
});

module.exports = CategoriesSchema;
