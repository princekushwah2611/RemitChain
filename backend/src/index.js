const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/rate", require("./routes/rate"));
app.use("/api/transaction", require("./routes/transaction"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "RemitChain API", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 RemitChain Backend Server running on http://localhost:${PORT}`);
});
