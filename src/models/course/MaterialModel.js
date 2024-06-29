const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Course schema
const materialSchema = new Schema(
  {
    words: [
      {
        ls: { type: String },
        rs: { type: String },
        word: { type: String },
        imageURL: { type: String },
        audioURL: { type: String },
        keyword: { type: Array },
        key: { type: String },
        sentence: { type: String },
      },
    ],
  },
  { collection: "materials" }
);

// Create the models

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
