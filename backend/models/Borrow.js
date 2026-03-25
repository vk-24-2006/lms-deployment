const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  books: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    name: String,
    author: String,
  }],
  borrowDate: { type: Date, default: Date.now },
  dueDate: { 
    type: Date, 
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
  },
  returnDate: { type: Date },
  status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
  // --- NEW FIELDS ---
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Borrow || mongoose.model("Borrow", borrowSchema);