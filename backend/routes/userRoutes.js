const express = require("express");
const User = require("../models/User");
const Borrow = require("../models/Borrow"); 
const Book = require("../models/Book");     
const router = express.Router();           

const { protect, authorize } = require("../middleware/authMiddleware");

// ✅ NEW: GET All Users (For Owner counts and System Settings)
router.get("/", protect, authorize("owner"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users: " + error.message });
  }
});

// ✅ 1. GET Borrow History for the Logged-in User
router.get("/borrow-history", protect, async (req, res) => {
  try {
    const history = await Borrow.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history: " + error.message });
  }
});

// ✅ 2. GET Current User Profile
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// ✅ 3. POST Confirm Borrow (Decreases Inventory)
router.post("/confirm-borrow", protect, async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newBorrow = new Borrow({
      user: req.user._id,
      books: cartItems.map((item) => ({
        bookId: item._id,
        name: item.name,
        author: item.author,
      })),
    });

    await newBorrow.save();

    for (const item of cartItems) {
      await Book.findByIdAndUpdate(item._id, { $inc: { available: -1 } });
    }

    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.status(201).json({ message: "Transaction successful!", data: newBorrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ 4. PUT Return Book (Increases Inventory & Updates Status)
// This is the specific logic you requested for the BorrowTrack page
router.put("/return-book/:id", protect, async (req, res) => {
  try {
    const borrowRecord = await Borrow.findById(req.params.id);

    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (borrowRecord.status === "returned") {
      return res.status(400).json({ message: "Books already returned" });
    }

    // Update status
    borrowRecord.status = "returned";
    await borrowRecord.save();

    // Increment book availability back in the Book collection
    for (const item of borrowRecord.books) {
      await Book.findByIdAndUpdate(item.bookId, { $inc: { available: 1 } });
    }

    res.json({ message: "Books returned successfully!", data: borrowRecord });
  } catch (error) {
    res.status(500).json({ message: "Return error: " + error.message });
  }
});

// ✅ 5. GET All Borrow Records (For Manage Users page - Owner/Employee)
router.get("/all-borrow-history", protect, authorize("employee", "owner"), async (req, res) => {
  try {
    const allHistory = await Borrow.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 });
    res.json(allHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records: " + error.message });
  }
});

module.exports = router;