const mongoose = require("mongoose");
const { Schema } = mongoose;

const unitProgressSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    unitId: { type: String, ref: "Unit", required: true },
    completed: { type: Number, default: 0 },
  },
  { collection: "unitProgress" }
);

const UnitProgress = mongoose.model("UnitProgress", unitProgressSchema);

module.exports = UnitProgress;
