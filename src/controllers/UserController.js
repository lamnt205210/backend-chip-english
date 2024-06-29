const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const passport = require("passport");
// Sign-up
const createUser = async (req, res) => {
  try {
    const { userName, password, confirmPassword } = req.body;

    if (!userName || !password || !confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "Please provide name, password and confirm password",
      });
    } else if (password != confirmPassword) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Password does not match" });
    }
    const response = await UserService.createUser(req.body);

    if (response.status === "ERR") {
      return res.status(400).json(response);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error });
  }
};
//Login
const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Please provide name and password" });
    }

    const response = await UserService.loginUser(req.body);
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
    const { refresh_token, ...newResponse } = response;
    console.log("refresh_token", refresh_token);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json(newResponse);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

// Log out
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res
      .status(200)
      .json({ status: "OK", message: "Logout successfully" });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
//Get details
const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Please provide user id" });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({ message: e });
  }
};

//Refresh token
const refreshToken = async (req, res) => {
  try {
    console.log("req.cookies", req.cookies);
    const token = req.cookies.refresh_token;
    if (!token) {
      return res
        .status(200)
        .json({ status: "ERR", message: "The token is required" });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({ message: e });
  }
};

const authGoogle = () => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  });
};
const authGoogleCallback = (req, res, next) => {
  return passport.authenticate("google", (err, data) => {
    req.data = data; // Attach the user object to the request
    console.log("data", req.data);
    const { user, access_token, refresh_token } = data;

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.redirect(
      `${process.env.URL_CLIENT}/dashboard?access_token=${access_token}`
    );
  })(req, res, next);
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getDetailsUser,
  refreshToken,
  authGoogle,
  authGoogleCallback,
};
