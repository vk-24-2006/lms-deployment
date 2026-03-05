const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");

// 🔹 OWNER: Update any user (including owner)
router.put("/update-user/:id", protect, authorize("owner"), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      user.email = email;
    }

    // Let User model handle hashing
    if (password && password.trim() !== "") {
      user.password = password;
    }

    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;