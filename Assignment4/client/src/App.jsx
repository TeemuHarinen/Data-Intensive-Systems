import { useState, useEffect } from 'react';
import Select from 'react-select';

function App() {
  const [operation, setOperation] = useState('');
  const [data, setData] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [newOrder, setNewOrder] = useState({ customer_id: '', product: '', amount: '' });
  const [id, setId] = useState('');
  const [dataType, setDataType] = useState('');

  const fetchData = (op) => {
    const currentOperation = op || operation;
    if (currentOperation === 'viewSqlCustomers' || currentOperation === 'addSqlCustomer' || currentOperation === 'modifySqlCustomer' || currentOperation === 'deleteSqlCustomer') {
      fetch('http://localhost:5959/api/sql/customers')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setDataType('SQL Customers');
        });
    } else if (currentOperation === 'viewSqlOrders' || currentOperation === 'addSqlOrder' || currentOperation === 'modifySqlOrder' || currentOperation === 'deleteSqlOrder') {
      fetch('http://localhost:5959/api/sql/orders')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setDataType('SQL Orders');
        });
    } else if (currentOperation === 'viewNosqlCustomers' || currentOperation === 'addNosqlCustomer' || currentOperation === 'modifyNosqlCustomer' || currentOperation === 'deleteNosqlCustomer') {
      fetch('http://localhost:5959/api/nosql/customers')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setDataType('NoSQL Customers');
        });
    } else if (currentOperation === 'viewNosqlOrders' || currentOperation === 'addNosqlOrder' || currentOperation === 'modifyNosqlOrder' || currentOperation === 'deleteNosqlOrder') {
      fetch('http://localhost:5959/api/nosql/orders')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setDataType('NoSQL Orders');
        });
    } else if (currentOperation === 'viewJoinedData') {
      fetch('http://localhost:5959/api/joined-data')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setDataType('Joined Data');
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [operation]);

  const handleAddCustomer = async (dbType) => {
    const url = dbType === 'sql' ? 'http://localhost:5959/api/sql/customers' : 'http://localhost:5959/api/nosql/customers';
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    setNewCustomer({ name: '', email: '' });
    fetchData(dbType === 'sql' ? 'viewSqlCustomers' : 'viewNosqlCustomers'); // Refresh data
  };

  const handleAddOrder = async (dbType) => {
    const url = dbType === 'sql' ? 'http://localhost:5959/api/sql/orders' : 'http://localhost:5959/api/nosql/orders';
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    });
    setNewOrder({ customer_id: '', product: '', amount: '' });
    fetchData(dbType === 'sql' ? 'viewSqlOrders' : 'viewNosqlOrders'); // Refresh data
  };

  const handleDelete = async (dbType, entity) => {
    const url = dbType === 'sql' ? `http://localhost:5959/api/sql/${entity}/${id}` : `http://localhost:5959/api/nosql/${entity}/${id}`;
    await fetch(url, {
      method: 'DELETE',
    });
    setId('');
    fetchData(dbType === 'sql' ? (entity === 'customers' ? 'viewSqlCustomers' : 'viewSqlOrders') : (entity === 'customers' ? 'viewNosqlCustomers' : 'viewNosqlOrders')); // Refresh data
  };

  const handleModifyCustomer = async (dbType) => {
    const url = dbType === 'sql' ? `http://localhost:5959/api/sql/customers/${id}` : `http://localhost:5959/api/nosql/customers/${id}`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    setNewCustomer({ name: '', email: '' });
    setId('');
    fetchData(dbType === 'sql' ? 'viewSqlCustomers' : 'viewNosqlCustomers'); // Refresh data
  };

  const handleModifyOrder = async (dbType) => {
    const url = dbType === 'sql' ? `http://localhost:5959/api/sql/orders/${id}` : `http://localhost:5959/api/nosql/orders/${id}`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    });
    setNewOrder({ customer_id: '', product: '', amount: '' });
    setId('');
    fetchData(dbType === 'sql' ? 'viewSqlOrders' : 'viewNosqlOrders'); // Refresh data
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
    { value: 'deleteSqlCustomer', label: 'Delete SQL Customer' },
    { value: 'deleteNosqlCustomer', label: 'Delete NoSQL Customer' },
    { value: 'deleteSqlOrder', label: 'Delete SQL Order' },
    { value: 'deleteNosqlOrder', label: 'Delete NoSQL Order' },
    { value: 'modifySqlCustomer', label: 'Modify SQL Customer' },
    { value: 'modifyNosqlCustomer', label: 'Modify NoSQL Customer' },
    { value: 'modifySqlOrder', label: 'Modify SQL Order' },
    { value: 'modifyNosqlOrder', label: 'Modify NoSQL Order' },
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

      {operation === 'deleteSqlCustomer' || operation === 'deleteNosqlCustomer' || operation === 'deleteSqlOrder' || operation === 'deleteNosqlOrder' ? (
        <div>
          <h2>Delete {operation.includes('Customer') ? 'Customer' : 'Order'}</h2>
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button onClick={() => handleDelete(operation.includes('Sql') ? 'sql' : 'nosql', operation.includes('Customer') ? 'customers' : 'orders')}>
            Delete from {operation.includes('Sql') ? 'SQL' : 'NoSQL'}
          </button>
        </div>
      ) : null}

      {operation === 'modifySqlCustomer' || operation === 'modifyNosqlCustomer' ? (
        <div>
          <h2>Modify Customer</h2>
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
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
          <button onClick={() => handleModifyCustomer(operation === 'modifySqlCustomer' ? 'sql' : 'nosql')}>
            Modify in {operation === 'modifySqlCustomer' ? 'SQL' : 'NoSQL'}
          </button>
        </div>
      ) : null}

      {operation === 'modifySqlOrder' || operation === 'modifyNosqlOrder' ? (
        <div>
          <h2>Modify Order</h2>
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
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
          <button onClick={() => handleModifyOrder(operation === 'modifySqlOrder' ? 'sql' : 'nosql')}>
            Modify in {operation === 'modifySqlOrder' ? 'SQL' : 'NoSQL'}
          </button>
        </div>
      ) : null}

      {data && (
        <div>
          <h2>Data: {dataType}</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;