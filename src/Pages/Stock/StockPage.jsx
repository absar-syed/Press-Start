import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StockPage.css';
import Navbar from '../../Components/Navbar';

function StockPage() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const navigate = useNavigate();

  // Fetch inventory
  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setInventory(result.data);
      })
      .catch((err) => console.error('Error fetching inventory:', err));
  }, []);

  // Search logic
  const filteredInventory = inventory.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.inventory_type.toLowerCase().includes(term) ||
      item.inventory_name.toLowerCase().includes(term) ||
      item.inventory_condition.toLowerCase().includes(term) ||
      (item.inventory_description?.toLowerCase() || '').includes(term)
    );
  });

  const displayInventory = search ? filteredInventory : inventory;

  // Start editing row
  const startEditing = (item) => {
    setEditingId(item.inventoryid);
    setEditValues({
      inventory_price: item.inventory_price,
      Inventory_num: item.Inventory_num
    });
  };

  // Handle input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  // Save updates
  const saveChanges = async (id) => {
    const price = Number(editValues.inventory_price);
    const quantity = Number(editValues.Inventory_num);

    if (isNaN(price) || price < 0) return alert("Price must be a positive number.");
    if (isNaN(quantity) || quantity < 0) return alert("Quantity must be a positive number.");

    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues)
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedInventory = inventory.map(item =>
        item.inventoryid === id ? { ...item, ...editValues } : item
      );
      setInventory(updatedInventory);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Error saving changes.");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Delete inventory item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Delete failed');
      setInventory((prev) => prev.filter((item) => item.inventoryid !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting item.");
    }
  };

  return (
    <div>
      <Navbar />
      <section className="stock-page">
        <h2>Inventory Management</h2>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success" onClick={() => navigate('/stock-update')}>
            Add Inventory
          </button>
          <input
            className="form-control w-50"
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Description</th>
                <th>Condition</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Special Edition</th>
                <th>Manual</th>
                <th>Box</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayInventory.map((item) => (
                <tr key={item.inventoryid}>
                  <td>{item.inventory_type}</td>
                  <td>{item.inventory_name}</td>
                  <td>{item.inventory_description}</td>
                  <td>{item.inventory_condition}</td>
                  <td>
                    {editingId === item.inventoryid ? (
                      <input
                        name="inventory_price"
                        type="number"
                        className="form-control"
                        value={editValues.inventory_price}
                        onChange={handleEditChange}
                      />
                    ) : (
                      `$${item.inventory_price}`
                    )}
                  </td>
                  <td>
                    {editingId === item.inventoryid ? (
                      <input
                        name="Inventory_num"
                        type="number"
                        className="form-control"
                        value={editValues.Inventory_num}
                        onChange={handleEditChange}
                      />
                    ) : (
                      item.Inventory_num
                    )}
                  </td>
                  <td>{item.inventory_special_edition ? 'Yes' : 'No'}</td>
                  <td>{item.inventory_manual ? 'Yes' : 'No'}</td>
                  <td>{item.inventory_box ? 'Yes' : 'No'}</td>
                  <td>{item.locations?.location_city}</td>
                  <td>
                    {editingId === item.inventoryid ? (
                      <div className="btn-group">
                        <button className="btn btn-sm btn-success" onClick={() => saveChanges(item.inventoryid)}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <div className="btn-group">
                        <button className="btn btn-sm btn-primary" onClick={() => startEditing(item)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.inventoryid)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default StockPage;
