const express = require("express");
const router = express.Router();
const { getExchangeRate } = require("../services/currencyService");

// GET /api/rate?from=USD&to=INR
router.get("/", async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await getExchangeRate(from, to);
    res.json({
      success: true,
      from: (from || "USD").toUpperCase(),
      to: (to || "INR").toUpperCase(),
      rate: result.rate,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
