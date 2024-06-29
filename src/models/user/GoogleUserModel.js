const mongoose = require("mongoose");
const BaseUser = require("./BaseUserModel");

const googleUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
});

const GoogleUser = BaseUser.discriminator("Google", googleUserSchema);

module.exports = GoogleUser;
