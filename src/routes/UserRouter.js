const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authUserMiddleware } = require("../middleware/authMiddleware");
const passport = require("passport");
router.post("/sign-up", userController.createUser);
router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);
router.get(
  "/get-details/:id",
  authUserMiddleware,
  userController.getDetailsUser
);
router.post("/refresh-token", userController.refreshToken);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get("/auth/google/callback", userController.authGoogleCallback);

// router.get(
//   "/auth/google/callback",
//   (req, res, next) => {
//     passport.authenticate("google", (err, user) => {
//       req.user = user; // Attach the user object to the request
//       next();
//     })(req, res, next);
//   },
//   (req, res) => {
//     res.redirect(`${process.env.URL_CLIENT}/dashboard`);
//   }
// );

module.exports = router;
