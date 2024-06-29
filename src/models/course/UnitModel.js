const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the unit schema
const unitSchema = new Schema(
  {
    courseId: { type: String, ref: "Course" }, // Reference to the Course schema
    semesterId: { type: String, ref: "Semester" }, // Reference to the Semester schema
    unitNumber: { type: Number, required: true },
    englishName: { type: String, required: true },
    vnName: { type: String, required: true },
    imageURL: { type: String, required: true },
  },
  { collection: "units" }
);

// Create the models

const Unit = mongoose.model("Unit", unitSchema);

module.exports = Unit;
