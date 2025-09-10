const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
    static async create({ name, email, password}) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );

        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    }
}

module.exports = User; 