const express = require("express");
const router = express.Router();
const Transaction = require("../models/transactions");
const auth = require("../middleware/auth");

// Summary route
router.get("/summary", auth, async (req, res) => {
  try {
    const summary = await Transaction.getSummary(req.user.id);
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Monthly breakdown
router.get("/monthly", auth, async (req, res) => {
  try {
    const breakdown = await Transaction.getMonthlyBreakdown(req.user.id);
    res.json(breakdown);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
