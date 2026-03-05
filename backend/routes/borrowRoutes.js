const express = require("express");
const router = express.Router();
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const { protect } = require("../middleware/authMiddleware");

// This route can stay as a backup or for single-book borrows
router.post("/confirm", protect, async (req, res) => {
  try {
    const { cartItems } = req.body;
    const newBorrow = new Borrow({
      user: req.user._id,
      books: cartItems.map(item => ({
        bookId: item._id,
        name: item.name,
        author: item.author
      }))
    });
    await newBorrow.save();
    res.status(201).json({ message: "Borrowed successfully", data: newBorrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;