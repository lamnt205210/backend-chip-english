const mongoose = require("mongoose");
const { Schema } = mongoose;

const lessonProgressSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    lessonId: { type: String, ref: "Lesson", required: true },
    completed: { type: Number, default: 0 },
    videoScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    maximumScore: { type: Number, default: 0 },
  },
  { collection: "lessonProgress" }
);

const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);

module.exports = LessonProgress;
