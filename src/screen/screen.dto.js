const Joi = require("joi");

const screenSchema = Joi.object({
  title: Joi.string().required(),
  screen_image: Joi.string().required(),
  bg_image: Joi.string().required(),
});

module.exports = screenSchema;
