const jwt = require("jsonwebtoken");

const generalAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
};

const generalRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "365d" });
};

const refreshTokenJwtService = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          resolve({ status: "ERR", message: "Invalid token" });
        }

        const access_token = generalAccessToken({ id: user?.id });

        resolve({ status: "OK", message: "SUCCESS", access_token });
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJwtService,
};
