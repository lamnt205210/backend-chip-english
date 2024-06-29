const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameProgressSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    gameId: { type: String, ref: "Game", required: true },
    score: { type: Number, default: 0 },
  },
  { collection: "gameProgress" }
);

const GameProgress = mongoose.model("GameProgress", gameProgressSchema);

module.exports = GameProgress;
