const Joi = require("joi");

const subscriptionSchema = Joi.object({
  plan_name: Joi.string(),

  number_search: Joi.number(),

  Plan_Subscription: Joi.number(),

  plan_subscription: Joi.string()
    .valid("monthly", "annually", "Both")
    .required(),

  startDate: Joi.date().default(() => new Date(), "current date"),

  renewDate: Joi.date(),

  amount: Joi.number().required(),

  plan_description: Joi.string(),
});

module.exports = subscriptionSchema;
