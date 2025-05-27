const userrouter = require("./user/user.route");
const contentrouter = require("./content/content.route");
const categoryrouter = require("./categories/categories.route");
const screenrouter = require("./screen/screen.route");
const articlerouter = require("./manage_Article/article.route");
const feedbackrouter = require("./feedback/feedback.route");
const authrouter = require("./auth/auth.route");
const planrouter = require("./plans/plans.route");
// const devicerouter = require("./manage_device/device.route");
const searchrouter = require("./search/search.route");
const servicerouter = require("./service/service.route");
const smtprouter = require("./smtp/smtp.route");
const paymentrouter = require("./payment/payment.route");
const cors = require("cors");
const Subscriptionrouter = require("./subscription/sub.route");
const privacyPolicy = require("./privacy_policy/privacy.route");
const contactUs = require("./contact_us/contactUs.route");
const termsConditions = require("./terms_condition/terms.route");
const plansubscriptionrouter = require("./plan_subscription/plan_subscription.route");
const addDevicerouter = require("./device/device.route");
const twilioRouter = require("./twilio/twilio.route");
const notificationrouter = require("./push_notification/notification.route");
const communityRequestRouter = require("./community/community.route");
const contentManagementRouter = require('./contentManagement/contentManagement.route');
const settingMailRouter = require('./setting/setting.route');
const postRouter = require('./post/post.route');
const courseRoutes = require('./courses/index');
const mediaManagementRouter = require('./mediaManagement/routes');

exports.registerRoutes = (app) => {
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use('/auth',authrouter);
  app.use(userrouter);
  app.use(contentrouter);
  app.use(categoryrouter);
  // app.use(devicerouter);
  app.use(screenrouter);
  app.use(articlerouter);
  app.use(feedbackrouter);
  app.use(searchrouter);
  app.use(servicerouter);
  app.use(privacyPolicy);
  app.use(contactUs);
  app.use(termsConditions);
  app.use(planrouter);
  app.use(smtprouter);
  app.use(paymentrouter);
  app.use(Subscriptionrouter);
  app.use(plansubscriptionrouter);
  app.use(addDevicerouter);
  app.use(twilioRouter);
  app.use(communityRequestRouter);
  app.use(contentManagementRouter);
  app.use(notificationrouter);
  app.use(settingMailRouter);
  app.use(postRouter);
  app.use(mediaManagementRouter);
  // Register all course module routes
  courseRoutes.forEach(router => app.use(router));
};
