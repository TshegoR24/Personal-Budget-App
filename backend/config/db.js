require('dotenv').config();

const { Pool } = require('pg');

function buildPoolFromEnv() {
	// Prefer DATABASE_URL when provided
	if (process.env.DATABASE_URL) {
		return new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: process.env.PGSSL === 'true' || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
		});
	}

	const hasBasics = process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE;
	if (!hasBasics) {
		return null;
	}

	return new Pool({
		host: process.env.PGHOST,
		user: process.env.PGUSER,
		password: process.env.PGPASSWORD,
		database: process.env.PGDATABASE,
		port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
		ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
	});
}

const pool = buildPoolFromEnv();

async function ensureSchema() {
    if (!pool) return;
    const createUsersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `;
    const createTransactionsTableSql = `
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            description VARCHAR(255) NOT NULL,
            amount NUMERIC(10,2) NOT NULL,
            type VARCHAR(10) CHECK (type IN ('income', 'expense')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await pool.query(createUsersTableSql);
    await pool.query(createTransactionsTableSql);
}

module.exports = { pool, ensureSchema };


