const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Teacher schema
const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    imageURL: { type: String, required: true },
  },
  { collection: "teachers" }
);
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
