import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StockPage.css';
import Navbar from '../../Components/Navbar';

function StockPage() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

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

  const handleUpdateClick = (id, item) => {
    setEditingRow(id);
    setEditedData(item);
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSave = (id) => {
    setInventory(
      inventory.map((item) => (item.inventoryid === id ? { ...item, ...editedData } : item))
    );
    setEditingRow(null);
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter((item) => item.inventoryid !== id));
  };

  const filteredInventory = inventory.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item.inventory_type.toLowerCase().includes(searchTerm) ||
      item.inventory_name.toLowerCase().includes(searchTerm) ||
      item.inventory_condition.toLowerCase().includes(searchTerm) ||
      (item.inventory_description?.toLowerCase() || '').includes(searchTerm)
    );
  });

  return (
    <div>
      <Navbar />
      <section className="stock-page">
        <h2>Look Up Inventory</h2>
        <button onClick={() => navigate('/stock-update')}>Add Inventory</button>
        <br></br>
        <br></br>
        <input 
          type="text" 
          placeholder="Search items..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
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
                <td className="text-nowrap">
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => handleUpdateClick(item.inventoryid, item)}>Update</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.inventoryid)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/*Modal*/}
      <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Inventory</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label>Item Type</label>
              <select className="form-control" value={editedData.inventory_type} onChange={(e) => handleChange(e, 'inventory_type')}>
                <option value="Console">Console</option>
                <option value="Accessory">Accessory</option>
                <option value="Game">Game</option>
              </select>
              <label>Title</label>
              <input className="form-control" type="text" value={editedData.inventory_name} onChange={(e) => handleChange(e, 'inventory_name')} />
              <label>Description</label>
              <input className="form-control" type="text" value={editedData.inventory_description} onChange={(e) => handleChange(e, 'inventory_description')} />
              <label>Condition</label>
              <select className="form-control" value={editedData.inventory_condition} onChange={(e) => handleChange(e, 'inventory_condition')}>
                <option value="Retro-Excellent">Retro-Excellent</option>
                <option value="Retro-Good">Retro-Good</option>
                <option value="Retro-Poor">Retro-Poor</option>
                <option value="New">New</option>
              </select>
              <label>Price</label>
              <input className="form-control" type="number" value={editedData.inventory_price} onChange={(e) => handleChange(e, 'inventory_price')} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={() => handleSave(editingRow)} data-bs-dismiss="modal">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockPage;
