import { useState, useEffect } from 'react';
import './StockPage.css';
import Navbar from '../../Components/Navbar';

function StockPage() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');

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

  // 1. Convert the user's search term to lowercase.
  // 2. Check if any relevant field (type, name, condition, etc.) contains the search term.
  const filteredInventory = inventory.filter((item) => {
    const searchTerm = search.toLowerCase();

    const type = item.inventory_type.toLowerCase();
    const name = item.inventory_name.toLowerCase();
    const condition = item.inventory_condition.toLowerCase();
    const description = item.inventory_description?.toLowerCase() || ''; 
    // Add as many fields as you want to search over

    return (
      type.includes(searchTerm) ||
      name.includes(searchTerm) ||
      condition.includes(searchTerm) ||
      description.includes(searchTerm)
    );
  });

  // If the user is typing something, show the filtered results. Otherwise show everything.
  const displayInventory = search ? filteredInventory : inventory;

  return (
    <div>
      <Navbar/>
      <section className="stock-page">
        <h2>Look Up Inventory</h2>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search item types, titles, descriptions, or conditions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* If you want a button to do something, you can keep it or remove it */}
          <button>Search</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Title</th>
              <th>Description</th>
              <th>Condition</th>
              <th>Price</th>
              <th>Special Edition</th>
              <th>Manual</th>
              <th>Box</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {displayInventory.map((item) => (
              <tr key={item.inventoryid}>
                <td>{item.inventory_type}</td>
                <td>{item.inventory_name}</td>
                <td>{item.inventory_description}</td>
                <td>{item.inventory_condition}</td>
                <td>{item.inventory_price}</td>
                <td>{item.inventory_special_edition ? 'Yes' : 'No'}</td>
                <td>{item.inventory_manual ? 'Yes' : 'No'}</td>
                <td>{item.inventory_box ? 'Yes' : 'No'}</td>
                <td>{item.locations?.location_city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default StockPage;
