import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import './ClientsSignUpPage.css'; // Optional: if you want to style it

function ClientSignUpPage() {
  const [formData, setFormData] = useState({
    client_fname: '',
    client_lname: '',
    client_email: '',
    client_phone: '',
    client_username: '',
    client_password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/clients/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setMessage('Client registered successfully!');
      setTimeout(() => {
        navigate('/clients'); // Redirect to client list after success
      }, 1500);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="repair-page">
        <h2>Client Sign-Up</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          {["client_fname", "client_lname", "client_email", "client_phone", "client_username", "client_password"].map((field) => (
            <div key={field} className="form-group">
              <label>{field.replace('client_', '').toUpperCase()}</label>
              <input
                name={field}
                type={field === 'client_password' ? 'password' : 'text'}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default ClientSignUpPage;
