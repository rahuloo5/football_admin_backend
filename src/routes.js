const userrouter = require("./user/user.route");
const contentrouter = require("./content/content.route");
const categoryrouter = require("./categories/categories.route");
const screenrouter = require("./screen/screen.route");
const articlerouter = require("./manage_Article/article.route");
const feedbackrouter = require("./feedback/feedback.route");
const authrouter = require("./auth/auth.route");
const subscriptionrouter = require("./Subscription/subscription.route");
const devicerouter = require("./manage_device/device.route");

exports.registerRoutes = (app) => {
  app.use(authrouter);
  app.use(userrouter);
  app.use(contentrouter);
  app.use(categoryrouter);
  app.use(devicerouter);
  app.use(screenrouter);
  app.use(articlerouter);
  app.use(feedbackrouter);
  app.use(subscriptionrouter);
};
