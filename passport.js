const UserService = require("./src/services/UserService");
const passport = require("passport");
const GoogleUser = require("./src/models/user/GoogleUserModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  generalAccessToken,
  generalRefreshToken,
} = require("./src/services/JwtService");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/user/auth/google/callback",
    },
    UserService.authenticateGoogleUser
    // async (accessToken, refreshToken, profile, done) => {
    //   try {
    //     console.log("profile", profile);
    //     if (profile) {
    //       const goUser = await GoogleUser.findOne({ googleId: profile.id });
    //       console.log("goUser", goUser);
    //       if (!goUser) {
    //         const newUser = await GoogleUser.create({
    //           googleId: profile.id,
    //           email: profile.emails[0].value,
    //           displayName: profile.displayName,
    //           profilePicture: profile.photos[0].value,
    //           typeUser: "Google",
    //         });
    //         console.log("newUser", newUser);
    //         done(null, newUser);
    //       } else {
    //         done(null, goUser);
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  )
);
