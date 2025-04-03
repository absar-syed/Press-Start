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

  const startEditing = (item) => {
    setEditingId(item.inventoryid);
    setEditValues({
      ...item,  // Include all the fields needed to edit
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: type === "radio" ? (value === "true") : value,
    }));
  };

  const saveChanges = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues),
      });

      if (!res.ok) throw new Error('Update failed');

      setInventory((prev) => prev.map(item => item.inventoryid === id ? { ...item, ...editValues } : item));
      setEditingId(null);

      alert('Item updated successfully');
    } catch (err) {
      console.error(err);
      alert("Error saving changes.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'DELETE',
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
        <h2>Look Up Inventory</h2>
        <button onClick={() => navigate('/stock-update')}>Add Inventory</button>
        <br /><br />
        <input 
          type="text" 
          placeholder="Search items..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />

        <table class="mb-5">
          <thead>
            <tr>
              <th>Item Type</th>
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
            {filteredInventory.map((item) => (
              <tr key={item.inventoryid}>
                <td>{item.inventory_type}</td>
                <td>{item.inventory_name}</td>
                <td>{item.inventory_description}</td>
                <td>{item.inventory_condition}</td>
                <td>{item.inventory_price}</td>
                <td>{item.inventory_num}</td>
                <td>{item.inventory_special_edition ? 'Yes' : 'No'}</td>
                <td>{item.inventory_manual ? 'Yes' : 'No'}</td>
                <td>{item.inventory_box ? 'Yes' : 'No'}</td>
                <td>{item.locations?.location_city}</td>
                <td className="text-nowrap">
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => startEditing(item)}>Update</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.inventoryid)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal */}
      <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Inventory</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form className='m-2' onSubmit={(e) => { e.preventDefault(); saveChanges(editingId); }}>
              <label>Item Type</label>
              <select className="form-control" name="inventory_type" value={editValues.inventory_type} onChange={handleEditChange}>
                <option value="Console">Console</option>
                <option value="Accessory">Accessory</option>
                <option value="Game">Game</option>
              </select>

              <label>Title</label>
              <input className="form-control" name="inventory_name" type="text" value={editValues.inventory_name} onChange={handleEditChange} required maxLength={50} />

              <label>Description</label>
              <input className="form-control" name="inventory_description" type="text" value={editValues.inventory_description} onChange={handleEditChange} required maxLength={250} />

              <label>Condition</label>
              <select className="form-control" name="inventory_condition" value={editValues.inventory_condition} onChange={handleEditChange}>
                <option value="Retro-Excellent">Retro-Excellent</option>
                <option value="Retro-Good">Retro-Good</option>
                <option value="Retro-Poor">Retro-Poor</option>
                <option value="New">New</option>
              </select>

              <label>Price</label>
              <input className="form-control" name="inventory_price" type="number" value={editValues.inventory_price} onChange={handleEditChange} min={0} required/>

              <label>Quantity</label>
              <input className="form-control" name="inventory_num" type="number" value={editValues.inventory_num} onChange={handleEditChange} min={0} max={100} required />

              <label>Special Edition</label>
              <br />
              <div className="btn-group-sm" role="group">
                <input type="radio" className="btn-check" name="inventory_special_edition" id="btnradio5" value="true"
                  checked={editValues.inventory_special_edition === true || editValues.inventory_special_edition === 'true'} onChange={handleEditChange} />
                <label className="btn btn-outline-light" htmlFor="btnradio5">Yes</label>

                <input type="radio" className="btn-check" name="inventory_special_edition" id="btnradio6" value="false"
                  checked={editValues.inventory_special_edition === false || editValues.inventory_special_edition === 'false'} onChange={handleEditChange} />
                <label className="btn btn-outline-light" htmlFor="btnradio6">No</label>
              </div>

              <label>Manual</label>
              <br />
              <div className="btn-group-sm" role="group">
                <input type="radio" className="btn-check" name="inventory_manual" id="btnradio1" value="true"
                  checked={editValues.inventory_manual === true || editValues.inventory_manual === 'true'} onChange={handleEditChange} />
                <label className="btn btn-outline-light" htmlFor="btnradio1">Yes</label>

                <input type="radio" className="btn-check" name="inventory_manual" id="btnradio2" value="false"
                  checked={editValues.inventory_manual === false || editValues.inventory_manual === 'false'} onChange={handleEditChange} />
                <label className="btn btn-outline-light" htmlFor="btnradio2">No</label>
              </div>

              <label>Box</label>
              <br />
              <div className="btn-group-sm" role="group">
                <input type="radio" className="btn-check" name="inventory_box" id="btnradio3" value="true"
                  checked={editValues.inventory_box === true || editValues.inventory_box === 'true'} onChange={handleEditChange} />
                <label className="btn btn-outline-light" htmlFor="btnradio3">Yes</label>

                <input type="radio" className="btn-check" name="inventory_box" id="btnradio4" value="false"
                  checked={editValues.inventory_box === false || editValues.inventory_box === 'false'} onChange={handleEditChange} />
                <label className="btn btn-outline-light" htmlFor="btnradio4">No</label>
              </div>

              <br/>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelEdit} data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Save Changes</button>
              </div>
            </form>


            {/* <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelEdit} data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-success" onClick={() => saveChanges(editingId)} data-bs-dismiss="modal">Save Changes</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockPage;
