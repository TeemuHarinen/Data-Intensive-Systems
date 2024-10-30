import { useState } from 'react';

function App() {
  const [region, setRegion] = useState('');
  const [table, setTable] = useState('');
  const [data, setData] = useState(null);

  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };

  const handleTableChange = (event) => {
    setTable(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5959/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region, table }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  return (
    <div className="App">
      <h1>Database Query</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Region:
        <br />
          <select value={region} onChange={handleRegionChange}>
            <option value="">Select...</option>
            <option value="europe">Europe</option>
            <option value="america">America</option>
            <option value="asia">Asia</option>
          </select>
        </label>
        <br />
        <label>
          Select Table:
        <br />
          <select value={table} onChange={handleTableChange}>
            <option value="">Select...</option>
            <option value="orders">Orders</option>
            <option value="customers">Customers</option>
            <option value="products">Products</option>
            <option value="employees">Employees</option>
          </select>
        </label>
        <button type="submit">Fetch Data</button>
      </form>

      {data && (
        <div>
          <h2>Data from {region} - {table}</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;