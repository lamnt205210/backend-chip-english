const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Course schema
const semesterSchema = new Schema(
  {
    name: { type: String, required: true },
    semesterNumber: { type: Number, required: true, unique: true },
  },
  { collection: "semesters" }
);

// Create the models

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;
