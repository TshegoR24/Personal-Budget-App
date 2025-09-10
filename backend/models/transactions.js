const { pool } = require("../config/db");

const Transaction = {
  async create({ user_id, amount, type, description }) {
    const result = await pool.query(
      "INSERT INTO transactions (user_id, description, amount, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, description, amount, type]
    );
    return result.rows[0];
  },

  async findByUser(userId) {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  },

  async delete(id, userId) {
    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    return result.rowCount > 0;
  },

  async getSummary(userId) {
    const result = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as balance
      FROM transactions
      WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async getMonthlyBreakdown(userId) {
    const result = await pool.query(
      `SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month DESC`,
      [userId]
    );
    return result.rows;
  },
};

module.exports = Transaction;


