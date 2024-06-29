const LocalUser = require("../models/user/LocalUserModel");
const GoogleUser = require("../models/user/GoogleUserModel");
const BaseUser = require("../models/user/BaseUserModel");
const { generalAccessToken } = require("./JwtService");
const { generalRefreshToken } = require("./JwtService");
const { initializeProgress } = require("./InitializeProgress");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

async function createUser(data) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userName, password } = data;

    const existingUser = await LocalUser.findOne({ userName }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return { status: "ERR", message: "Username already taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await LocalUser.create(
      [{ userName, password: hashedPassword, typeUser: "Local" }],
      { session }
    );
    const user = newUser[0];

    await initializeProgress(user._id);

    await session.commitTransaction();
    session.endSession();

    return {
      status: "OK",
      message: "User created successfully",
      user: newUser,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return { status: "ERR", message: error.message };
  }
}
// async function createUser(data) {
//   try {
//     const { userName, password } = data;

//     // Check if the username already exists

//     const existingUser = await LocalUser.findOne({ userName });
//     if (existingUser) {
//       return { status: "ERR", message: "Username already taken" };
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new local user

//     const newUser = await LocalUser.create({
//       userName: userName,
//       password: hashedPassword,
//       typeUser: "Local",
//     });

//     return {
//       status: "OK",
//       message: "User created successfully",
//       user: newUser,
//     };
//   } catch (error) {
//     console.log(error);
//     return { status: "ERR", message: error.message };
//   }
// }

async function loginUser(data) {
  const { userName, password } = data;

  // Find the user by username
  const user = await LocalUser.findOne({ userName });
  if (!user) {
    return { status: "ERR", message: "Username does not exist" };
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { status: "ERR", message: "Invalid username or password" };
  }

  // Generate JWT tokens
  const access_token = generalAccessToken({ id: user._id });
  const refresh_token = generalRefreshToken({ id: user._id });

  return {
    status: "OK",
    message: "Login successful",
    access_token,
    refresh_token,
  };
}

async function getDetailsUser(userId) {
  // Find the user by ID
  const user = await BaseUser.findById(userId);
  if (!user) {
    return { status: "ERR", message: "User not found" };
  }
  return { status: "OK", user };
}

const authenticateGoogleUser = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    console.log("profile", profile);
    if (profile) {
      let user = await GoogleUser.findOne({ googleId: profile.id });

      if (!user) {
        user = await GoogleUser.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
          profilePicture: profile.photos[0].value,
          typeUser: "Google",
        });
        // Initialize progress for the new user
        await initializeProgress(user._id);
      }

      const access_token = generalAccessToken({ id: user._id });
      const refresh_token = generalRefreshToken({ id: user._id });
      done(null, { user, access_token, refresh_token });
      // done(null, user);
    }
  } catch (error) {
    console.log(error);
    done(error, null);
  }
};

module.exports = {
  createUser,
  loginUser,
  getDetailsUser,
  authenticateGoogleUser,
};
