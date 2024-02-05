const Joi = require("joi");

const commentJoiSchema = Joi.object({
  //   User: Joi.string().required(),
  comment: Joi.string().required(),
});

module.exports = commentJoiSchema;
