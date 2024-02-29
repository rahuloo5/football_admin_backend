const userrouter = require("./user/user.route");
const contentrouter = require("./content/content.route");
const categoryrouter = require("./categories/categories.route");
const screenrouter = require("./screen/screen.route");
const articlerouter = require("./manage_Article/article.route");
const feedbackrouter = require("./feedback/feedback.route");
const authrouter = require("./auth/auth.route");
const planrouter = require("./plans/plans.route");
const devicerouter = require("./manage_device/device.route");
const searchrouter = require("./search/search.route");
const servicerouter = require("./service/service.route");
const smtprouter = require("./smtp/smtp.route");
const paymentrouter = require("./payment/payment.route");
const cors = require("cors");
const Subscriptionrouter = require("./subscription/sub.route");
const plansubscriptionrouter = require("./plan_subscription/plan_subscription.route");
const notificationrouter = require("./push_notification/notification.route");

exports.registerRoutes = (app) => {
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(authrouter);
  app.use(userrouter);
  app.use(contentrouter);
  app.use(categoryrouter);
  app.use(devicerouter);
  app.use(screenrouter);
  app.use(articlerouter);
  app.use(feedbackrouter);
  app.use(searchrouter);
  app.use(servicerouter);
  app.use(planrouter);
  app.use(smtprouter);
  app.use(paymentrouter);
  app.use(Subscriptionrouter);
  app.use(plansubscriptionrouter);

  // app.use(notificationrouter);
};
