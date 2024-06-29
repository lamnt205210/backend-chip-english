const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const authUserMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    console.log("err", err);
    if (err) {
      return res
        .status(404)
        .json({ message: "Token is not valid", status: "ERROR" });
    }
    console.log("user", user);
    console.log("userId", userId);
    if (user?.id === userId) {
      next();
    } else {
      return res
        .status(404)
        .json({ message: "Token is not valid 2", status: "ERROR" });
    }
  });
};

module.exports = { authUserMiddleware };
