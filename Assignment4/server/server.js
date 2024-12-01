// TO DO:
// fix nosql routes
// improve data to show what its showing (based off operation variable)
// join data from both db
// refresh data screen after inserting a new item


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const mongoose = require('mongoose');
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

// MongoDB Configuration
mongoose.connect(process.env.MONGO_URI);

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const OrderSchema = new mongoose.Schema({
  customer_id: Number,
  product: String,
  amount: Number,
});

const Customer = mongoose.model('Customer', CustomerSchema);
const Order = mongoose.model('Order', OrderSchema);

// PostgreSQL Routes
app.get('/api/sql/customers', async (req, res) => {
  const pool = new Pool(dbConfigs.europe);
  
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.get('/api/sql/orders', async (req, res) => {
  const pool = new Pool(dbConfigs.europe);
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.post('/api/sql/customers', async (req, res) => {
  const { name, email } = req.body;
  const pool = new Pool(dbConfigs.europe);
  try {
    const result = await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.post('/api/sql/orders', async (req, res) => {
  const { customer_id, product, amount } = req.body;
  const pool = new Pool(dbConfigs.europe);
  try {
    const result = await pool.query('INSERT INTO orders (customer_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [customer_id, product, amount]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.delete('/api/sql/customers/:id', async (req, res) => {
  const { id } = req.params;
  const pool = new Pool(dbConfigs.europe);
  try {
    await pool.query('DELETE FROM customers WHERE customer_id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.delete('/api/sql/orders/:id', async (req, res) => {
  const { id } = req.params;
  const pool = new Pool(dbConfigs.europe);
  try {
    await pool.query('DELETE FROM orders WHERE order_id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.put('/api/sql/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const pool = new Pool(dbConfigs.europe);
  try {
    const result = await pool.query('UPDATE customers SET name = $1, email = $2 WHERE customer_id = $3 RETURNING *', [name, email, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.put('/api/sql/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { customer_id, product, amount } = req.body;
  const pool = new Pool(dbConfigs.europe);
  try {
    const result = await pool.query('UPDATE orders SET customer_id = $1, product_id = $2, quantity = $3 WHERE order_id = $4 RETURNING *', [customer_id, product, amount, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

// MongoDB Routes (NoSQL)
app.get('/api/nosql/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/nosql/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/nosql/customers', async (req, res) => {
  const { name, email } = req.body;
  try {
    const customer = new Customer({ name, email });
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/nosql/orders', async (req, res) => {
  const { customer_id, product, amount } = req.body;
  console.log(req.body);
  try {
    const order = new Order({ customer_id, product, amount });
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/nosql/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/nosql/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Order.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/nosql/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const customer = await Customer.findByIdAndUpdate(id, { name, email }, { new: true });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/nosql/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { customer_id, product, amount } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { customer_id, product, amount }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to join data from both databases
app.get('/api/joined-data', async (req, res) => {
  const pool = new Pool(dbConfigs.europe);
  try {
    // Fetch data from PostgreSQL
    const sqlCustomers = await pool.query('SELECT * FROM customers');
    const sqlOrders = await pool.query('SELECT * FROM orders');

    // Fetch data from MongoDB
    const nosqlCustomers = await Customer.find();
    const nosqlOrders = await Order.find();

    const combinedData = {
      sqlCustomers: sqlCustomers.rows,
      sqlOrders: sqlOrders.rows,
      nosqlCustomers,
      nosqlOrders,
    };

    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    pool.end();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});