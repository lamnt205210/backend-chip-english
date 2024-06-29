const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Course schema
const courseSchema = new Schema(
  {
    courseNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageURL: { type: String, required: true },
    teacher: [{ type: Schema.Types.ObjectId, ref: "Teacher" }], // Reference to the Teacher schema
  },
  { collection: "courses" }
);

// Create the models

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
