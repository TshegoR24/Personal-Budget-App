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

module.exports = { pool };


