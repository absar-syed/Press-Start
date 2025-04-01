import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import './StockUpdatePage.css';

function StockInsertPage() {
  const [formData, setFormData] = useState({
    inventory_name: '',
    inventory_description: '',
    inventory_type: 'Console',
    inventory_price: '',
    inventory_condition: 'New',
    inventory_special_edition: 'false',
    inventory_manual: 'false',
    inventory_box: 'false',
    locationid: ''
  });

  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(result => {
        if (result.data) setLocations(result.data);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const body = {
      ...formData,
      inventory_special_edition: formData.inventory_special_edition === 'true',
      inventory_manual: formData.inventory_manual === 'true',
      inventory_box: formData.inventory_box === 'true'
    };

    try {
      const res = await fetch('http://localhost:5000/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('Inventory added successfully!');
      setTimeout(() => {
        navigate('/stock'); // Redirect to stock after success
      }, 1500);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="stock-insert-page">
        <h2>Add New Inventory Item</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input name="inventory_name" placeholder="Name" value={formData.inventory_name} onChange={handleChange} required />
          <input name="inventory_description" placeholder="Description" value={formData.inventory_description} onChange={handleChange} required />
          <input name="inventory_price" placeholder="Price" type="number" value={formData.inventory_price} onChange={handleChange} required />

          <label>Type:</label>
          <select name="inventory_type" value={formData.inventory_type} onChange={handleChange}>
            <option value="Console">Console</option>
            <option value="Game">Game</option>
            <option value="Accessory">Accessory</option>
          </select>

          <label>Condition:</label>
          <select name="inventory_condition" value={formData.inventory_condition} onChange={handleChange}>
            <option value="New">New</option>
            <option value="Retro-Excellent">Retro-Excellent</option>
            <option value="Retro-Good">Retro-Good</option>
            <option value="Retro-Poor">Retro-Poor</option>
          </select>

          <label>Special Edition?</label>
          <select name="inventory_special_edition" value={formData.inventory_special_edition} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          <label>Includes Manual?</label>
          <select name="inventory_manual" value={formData.inventory_manual} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          <label>Includes Box?</label>
          <select name="inventory_box" value={formData.inventory_box} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          <label>Location:</label>
          <select name="locationid" value={formData.locationid} onChange={handleChange} required>
            <option value="">Select a location</option>
            {locations.map(loc => (
              <option key={loc.locationid} value={loc.locationid}>
                {loc.location_city}
              </option>
            ))}
          </select>

          <button type="submit">Add Inventory</button>
        </form>
      </section>
    </div>
  );
}

export default StockInsertPage;