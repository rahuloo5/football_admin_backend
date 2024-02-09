const Joi = require("joi");

const subscriptionValidation = Joi.object({
  name: Joi.string(),
  text_message_count: Joi.number().required(),
  Subscription: Joi.string().valid("monthly", "annually", "Both").required(),
  amount: Joi.number().default(0).required(),
  description: Joi.string(),
}).options({ abortEarly: false, stripUnknown: true });

module.exports = subscriptionValidation;
