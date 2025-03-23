import { useState, useEffect } from 'react';
import './StockPage.css';
import Navbar from '../../Components/Navbar';
function StockPage() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch inventory data when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setInventory(result.data);
        }
      })
      .catch((error) => console.error('Error fetching inventory:', error));
  }, []);

  // If search functionality is added later, you could filter inventory like so:
  const filteredInventory = inventory.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item.inventory_type.toLowerCase().includes(searchTerm) ||
      item.inventory_name.toLowerCase().includes(searchTerm) ||
      item.inventory_condition.toLowerCase().includes(searchTerm)
    );
  });

  // For now, if search is not functional, simply display all inventory
  const displayInventory = search ? filteredInventory : inventory;

  return (
    <div>
    <Navbar/>
    <section className="stock-page">
      <h2>Look Up Inventory</h2>
      <div className="search-container">
        {/* Search input and button (non-functional for now) */}
        <input 
          type="text" 
          placeholder="Search item types, titles, or conditions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item Type</th>
            <th>Title</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {displayInventory.map((item) => (
            <tr key={item.inventoryid}>
              <td>{item.inventory_type}</td>
              <td>{item.inventory_name}</td>
              <td>{item.inventory_condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
    </div>
  );
}

export default StockPage;

