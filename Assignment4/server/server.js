// TODO:
// Why dropdown missing item?
// Backend working.

import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function App() {
  const [operation, setOperation] = useState('');
  const [data, setData] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [newOrder, setNewOrder] = useState({ customer_id: '', product: '', amount: '' });

  useEffect(() => {
    if (operation === 'viewSqlCustomers') {
      fetch('http://localhost:5959/api/sql/customers')
        .then(response => response.json())
        .then(data => setData(data));
    } else if (operation === 'viewSqlOrders') {
      fetch('http://localhost:5959/api/sql/orders')
        .then(response => response.json())
        .then(data => setData(data));
    } else if (operation === 'viewNosqlCustomers') {
      fetch('http://localhost:5959/api/nosql/customers')
        .then(response => response.json())
        .then(data => setData(data));
    } else if (operation === 'viewNosqlOrders') {
      fetch('http://localhost:5959/api/nosql/orders')
        .then(response => response.json())
        .then(data => setData(data));
    } else if (operation === 'viewJoinedData') {
      fetch('http://localhost:5959/api/joined-data')
        .then(response => response.json())
        .then(data => setData(data));
    }
  }, [operation]);

  const handleAddCustomer = async (dbType) => {
    const url = dbType === 'sql' ? 'http://localhost:5959/api/sql/customers' : 'http://localhost:5959/api/nosql/customers';
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    setNewCustomer({ name: '', email: '' });
    setOperation(''); // Reset operation to refresh data
  };

  const handleAddOrder = async (dbType) => {
    const url = dbType === 'sql' ? 'http://localhost:5959/api/sql/orders' : 'http://localhost:5959/api/nosql/orders';
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    });
    setNewOrder({ customer_id: '', product: '', amount: '' });
    setOperation(''); // Reset operation to refresh data
  };

  const options = [
    { value: 'viewSqlCustomers', label: 'View SQL Customers' },
    { value: 'viewSqlOrders', label: 'View SQL Orders' },
    { value: 'viewNosqlCustomers', label: 'View NoSQL Customers' },
    { value: 'viewNosqlOrders', label: 'View NoSQL Orders' },
    { value: 'viewJoinedData', label: 'View Joined Data' },
    { value: 'addSqlCustomer', label: 'Add SQL Customer' },
    { value: 'addNosqlCustomer', label: 'Add NoSQL Customer' },
    { value: 'addSqlOrder', label: 'Add SQL Order' },
    { value: 'addNosqlOrder', label: 'Add NoSQL Order' },
  ];

  return (
    <div>
      <h1>Database Operations</h1>
      <Select
        value={options.find(option => option.value === operation)}
        onChange={(selectedOption) => setOperation(selectedOption.value)}
        options={options}
      />

      {operation === 'addSqlCustomer' || operation === 'addNosqlCustomer' ? (
        <div>
          <h2>Add Customer</h2>
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <button onClick={() => handleAddCustomer(operation === 'addSqlCustomer' ? 'sql' : 'nosql')}>
            Add to {operation === 'addSqlCustomer' ? 'SQL' : 'NoSQL'}
          </button>
        </div>
      ) : null}

      {operation === 'addSqlOrder' || operation === 'addNosqlOrder' ? (
        <div>
          <h2>Add Order</h2>
          <input
            type="text"
            placeholder="Customer ID"
            value={newOrder.customer_id}
            onChange={(e) => setNewOrder({ ...newOrder, customer_id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product"
            value={newOrder.product}
            onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newOrder.amount}
            onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
          />
          <button onClick={() => handleAddOrder(operation === 'addSqlOrder' ? 'sql' : 'nosql')}>
            Add to {operation === 'addSqlOrder' ? 'SQL' : 'NoSQL'}
          </button>
        </div>
      ) : null}

      {data && (
        <div>
          <h2>Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;