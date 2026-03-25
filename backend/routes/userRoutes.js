const express = require("express");
const User = require("../models/User");
const Borrow = require("../models/Borrow"); 
const Book = require("../models/Book");     
const router = express.Router();           
const { protect, authorize } = require("../middleware/authMiddleware");

// ==========================================
// PUBLIC ROUTES (No Token Required)
// ==========================================

// 1. REGISTER NEW USER
// This must stay ABOVE the "protect" middleware
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already registered with this email" });
    }

    const user = await User.create({
      name,
      email,
      password, // Note: Ensure your User model hashes this password!
      role: "user" 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Registration Error: " + error.message });
  }
});

// ==========================================
// PROTECTED ROUTES (Token Required)
// ==========================================

// 2. GET CURRENT LOGGED-IN USER
router.get("/me", protect, async (req, res) => { 
  res.json(req.user); 
});

// 3. GET INDIVIDUAL USER BORROW HISTORY
router.get("/borrow-history", protect, async (req, res) => {
  try {
    const history = await Borrow.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history: " + error.message });
  }
});

// 4. PAYING A FINE
router.post("/pay-fine", protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      fine: 0,
      isBlocked: false
    });
    await Borrow.updateMany({ user: req.user._id }, { finePaid: true });
    res.json({ message: "Fine paid and account unblocked" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 5. CONFIRM BORROW (Checkout)
router.post("/confirm-borrow", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isBlocked || user.fine > 0) {
      return res.status(403).json({ message: "Pay pending fines to borrow books" });
    }

    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const newBorrow = new Borrow({
      user: req.user._id,
      books: cartItems.map(item => ({
        bookId: item._id, 
        name: item.name, 
        author: item.author
      })),
    });

    await newBorrow.save();

    for (const item of cartItems) {
      await Book.findByIdAndUpdate(item._id, { $inc: { available: -1 } });
    }

    res.status(201).json({ message: "Borrowed successfully!", data: newBorrow });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// 6. RETURN BOOK
router.put("/return-book/:id", protect, async (req, res) => {
  try {
    const borrowRecord = await Borrow.findById(req.params.id);
    if (!borrowRecord) return res.status(404).json({ message: "Record not found" });
    if (borrowRecord.status === "returned") return res.status(400).json({ message: "Already returned" });

    borrowRecord.status = "returned";
    borrowRecord.returnDate = Date.now();
    await borrowRecord.save();

    for (const item of borrowRecord.books) {
      await Book.findByIdAndUpdate(item.bookId, { $inc: { available: 1 } });
    }

    res.json({ message: "Returned!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// ADMIN/OWNER ONLY ROUTES
// ==========================================

// 7. GET ALL USERS
router.get("/", protect, authorize("owner"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});

// 8. ISSUING A FINE
router.post("/add-fine/:borrowId", protect, authorize("owner"), async (req, res) => {
  try {
    const { amount } = req.body;
    const borrow = await Borrow.findById(req.params.borrowId);
    if (!borrow) return res.status(404).json({ message: "Record not found" });

    borrow.fineAmount = amount;
    await borrow.save();

    await User.findByIdAndUpdate(borrow.user, { 
      $inc: { fine: amount },
      isBlocked: true 
    });

    res.json({ message: "Fine issued and user blocked" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 9. ALL BORROW HISTORY
router.get("/all-borrow-history", protect, authorize("employee", "owner"), async (req, res) => {
  try {
    const allHistory = await Borrow.find()
      .populate("user", "name email fine isBlocked")
      .sort({ createdAt: -1 });
    res.json(allHistory);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;