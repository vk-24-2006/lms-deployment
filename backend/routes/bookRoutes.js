const router = require("express").Router();
const Book = require("../models/Book");
const { protect, authorize } = require("../middleware/authMiddleware");

// ---------------- Get All Books (PUBLIC) ----------------
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error("Get books error:", err);
    res.status(500).json({ message: "Server error while fetching books" });
  }
});

// ---------------- Search Books (NEW & PUBLIC) ----------------
// Note: This MUST stay above /:id
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const books = await Book.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
    res.json(books);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error during search" });
  }
});

// ---------------- Get Single Book (PUBLIC) ----------------
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= PROTECTED ROUTES BELOW =================

// ---------------- Add New Book (EMPLOYEE ONLY) ----------------
router.post("/", protect, authorize("employee"), async (req, res) => {
  try {
    const { name, author, category, available } = req.body;
    if (!name || !author || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    const newBook = new Book({
      name,
      author,
      category,
      available: available ? Number(available) : 1,
    });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: "Server error while adding book" });
  }
});

// ---------------- Update Availability (EMPLOYEE ONLY) ----------------
router.put("/:id", protect, authorize("employee"), async (req, res) => {
  try {
    const { available } = req.body;
    if (available === undefined || available < 0) {
      return res.status(400).json({ message: "Valid availability is required" });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { available: Number(available) },
      { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: "Server error while updating" });
  }
});

// ---------------- Delete Book (EMPLOYEE ONLY) ----------------
router.delete("/:id", protect, authorize("employee"), async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting" });
  }
});

module.exports = router;