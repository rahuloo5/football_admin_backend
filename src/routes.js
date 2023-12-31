const userrouter = require("./user/user.route");
const contentrouter = require("./content/content.route");
const categoryrouter = require("./categories/categories.route");
const devicerouter = require("./manage_device/device.route");

exports.registerRoutes = (app) => {
  app.use(userrouter);
  app.use(contentrouter);
  app.use(categoryrouter);
  app.use(devicerouter);
};
