const userrouter = require("./user/user.route");

exports.registerRoutes = (app) => {
  app.use(userrouter);
};
