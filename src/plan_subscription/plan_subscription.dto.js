const Joi = require("joi");
const subscriptionValidationSchema = Joi.object({
  planName: Joi.string().required(),
  numberOfSearchAllowed: Joi.number().integer().required(),
  planSubscription: Joi.string()
    .valid("monthly", "annually", "both")
    .required(),
  planAmount: Joi.number().required(),
  planDescription: Joi.string(),
});

module.exports = { subscriptionValidationSchema };
