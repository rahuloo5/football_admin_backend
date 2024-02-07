const Joi = require("joi");

const deviceSchema = Joi.object({
  device_name: Joi.string().required(),
  description: Joi.string().required(),
  categorie: Joi.string().required(),
  sub_categorie: Joi.string().required(),
  Images: Joi.string().required(),
  video_url: Joi.string().url().required(),
  policy_url: Joi.string().url().required(),
  secuirty_overview: Joi.string().required(),
  privacy_overview: Joi.string().required(),
  video_url1: Joi.string().required(),
  policy_url1: Joi.string().required(),
  other_information: Joi.string().required(),
  terms_conditions: Joi.string().required(),
});
module.exports = deviceSchema;
