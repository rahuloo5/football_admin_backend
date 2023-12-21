const Joi = require("joi");

const userSchema = Joi.object({
  created_at: Joi.number().required(),
  username: Joi.string().required(),
  email_id: Joi.string().email().required(),
  phome_number: Joi.number().required(),
  payment_plan: Joi.string().required(),
});

module.exports = userSchema;
