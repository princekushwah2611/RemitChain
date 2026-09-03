const express = require("express");
const router = express.Router();

const syncedTransactions = [];

// POST /api/transaction/sync
router.post("/sync", (req, res) => {
  try {
    const tx = req.body;
    if (!tx || !tx.transferId) {
      return res.status(400).json({ success: false, error: "Invalid transaction payload" });
    }

    syncedTransactions.unshift({
      ...tx,
      syncedAt: new Date().toISOString(),
    });

    res.json({ success: true, count: syncedTransactions.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/transaction/history
router.get("/history", (req, res) => {
  res.json({ success: true, transactions: syncedTransactions });
});

module.exports = router;
