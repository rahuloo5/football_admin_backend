const Joi = require("joi");
const subscriptionValidationSchema = Joi.object({
  planName: Joi.string().required(),
  numberOfSearchAllowed: Joi.number().integer().required(),
  planSubscription: Joi.string()
    .valid("monthly", "annually", "both")
    .required(),
  planAmount: Joi.number().required(),
  planDescription: Joi.string(),
  productId: Joi.string(),
  deviceId: Joi.string(),
});

module.exports = { subscriptionValidationSchema };
