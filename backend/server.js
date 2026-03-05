const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

// ================= ROUTES =================
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/auth")); // changed to /api/auth (clean structure)
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/borrow", require("./routes/borrowRoutes"));
app.use("/api/system", require("./routes/systemRoutes"));

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lmDB1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);