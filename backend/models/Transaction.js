const pool = require("../config/db");

class Transaction {
    static async create({ user_id, amount, type, category, description }) {
        const result = await pool.query(
            "INSERT INTO transactions (user_id, amount, type, category, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, amount, type, category, description]
        );
        return result.rows[0];
    }

    static async findByUser(user_id) {
        const result = await pool.query(
           "SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC",
           [user-id] 
        );
        return result.rows;
    }

    static async delete(id, user_id) {
        const result = await pool.query(
            "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, user_id]
        );
        return result.rows[0];
    }
} 

module.exports = Transactions;

