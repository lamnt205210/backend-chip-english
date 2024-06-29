const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseProgressSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    courseId: { type: String, ref: "Course", required: true },
    completed: { type: Number, default: 0 },
  },
  { collection: "courseProgress" }
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;
