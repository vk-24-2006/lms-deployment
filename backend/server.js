const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/auth")); 
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/borrow", require("./routes/borrowRoutes"));
app.use("/api/system", require("./routes/systemRoutes"));

// Root route for testing
app.get("/", (req, res) => {
  res.send("LMS API is running...");
});

// ================= DATABASE =================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lmDB1";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`🚀 MongoDB Connected to: ${MONGO_URI}`))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);