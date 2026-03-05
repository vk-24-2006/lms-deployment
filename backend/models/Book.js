// backend/models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    available: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);