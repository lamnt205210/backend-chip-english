const mongoose = require("mongoose");
const BaseUser = require("./BaseUserModel");

const localUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please tell us your name!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
});

const LocalUser = BaseUser.discriminator("Local", localUserSchema);

module.exports = LocalUser;
