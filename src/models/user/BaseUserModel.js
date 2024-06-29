const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "typeUser", // Our discriminator key
  collection: "users", // Collection name in MongoDB
  timestamps: true,
};

const BaseUserSchema = new mongoose.Schema(
  {
    typeUser: {
      type: String,
      required: true,
      enum: ["Google", "Local"],
    },
  },
  baseOptions
);

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);

module.exports = BaseUser;
