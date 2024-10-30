require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 5959;

app.use(cors());
app.use(express.json());

const dbConfigs = {
  europe: {
    user: process.env.DB_EUROPE_USER,
    host: process.env.DB_EUROPE_HOST,
    database: process.env.DB_EUROPE_DATABASE,
    password: process.env.DB_EUROPE_PASSWORD,
    port: process.env.DB_EUROPE_PORT,
  },
  america: {
    user: process.env.DB_AMERICA_USER,
    host: process.env.DB_AMERICA_HOST,
    database: process.env.DB_AMERICA_DATABASE,
    password: process.env.DB_AMERICA_PASSWORD,
    port: process.env.DB_AMERICA_PORT,
  },
  asia: {
    user: process.env.DB_ASIA_USER,
    host: process.env.DB_ASIA_HOST,
    database: process.env.DB_ASIA_DATABASE,
    password: process.env.DB_ASIA_PASSWORD,
    port: process.env.DB_ASIA_PORT,
  },
};

app.post('/api/data', async (req, res) => {
  const { region, table } = req.body;
  console.log(region, table);
  if (!dbConfigs[region]) {
    return res.status(400).json({ error: 'Invalid region specified' });
  }

  if (!['orders', 'customers', 'products', 'employees'].includes(table)) {
    return res.status(400).json({ error: 'Invalid table specified' });
  }

  const pool = new Pool(dbConfigs[region]);

  try {
    // Query the database based on region and table
    const result = await pool.query(`SELECT * FROM ${table}`);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ error: 'No data found for the specified table' });
    }
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});