const UserRouter = require("./UserRouter");
const CourseRouter = require("./CourseRouter");
const ProgressRouter = require("./ProgressRouter");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/course", CourseRouter);
  app.use("/api/progress", ProgressRouter);
};
module.exports = routes;
