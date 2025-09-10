require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { pool, ensureSchema } = require('./config/db');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
	res.json({ status: 'ok', service: 'backend' });
});

app.get('/health', async (req, res) => {
	try {
		if (pool) {
			await pool.query('SELECT 1');
			return res.json({ status: 'ok', db: 'connected' });
		}
		return res.json({ status: 'ok', db: 'not_configured' });
	} catch (err) {
		return res.status(500).json({ status: 'error', message: err.message });
	}
});

const port = process.env.PORT || 5000;

(async () => {
	try {
		await ensureSchema();
	} catch (err) {
		console.error('Error ensuring schema:', err);
	}

	app.listen(port, () => {
		console.log(`Backend listening on port ${port}`);
	});
})();


