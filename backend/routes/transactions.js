const express = require("express");
const Transaction = require("../models/transactions");
const auth = require("../middleware/auth");

const router = express.Router();

// Add new transaction
router.post("/", auth, async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;
    const newTx = await Transaction.create({
      user_id: req.user.id,
      amount,
      type,
      category,
      description,
    });
    res.json(newTx);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all user transactions
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.findByUser(req.user.id);
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Transaction.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", deleted });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
