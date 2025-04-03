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
          <input name='client_fname' placeholder='First Name' type='text' value={formData.client_fname} onChange={handleChange} required maxLength={25}/>
          <input name='client_lname' placeholder='Last Name' type='text' value={formData.client_lname} onChange={handleChange} required maxLength={25}/>
          <input name='client_email' placeholder='Email' type='email' value={formData.client_email} onChange={handleChange} required maxLength={100}/>
          <input name='client_phone' placeholder='Phone Number Example(1234567890)' type='tel' pattern="[0-9]{3}[0-9]{3}[0-9]{4}" value={formData.client_phone} onChange={handleChange} required maxLength={10} min={0} max={9999999999}/>
          <input name='client_username' placeholder='Username' type='text' value={formData.client_username} onChange={handleChange} required maxLength={25}/>
          <input name='client_password' placeholder='Password' type='password' value={formData.client_password} onChange={handleChange} required maxLength={25}/>
          <button type="submit">Sign Up</button>
        </form>
        
      </div>
    </div>
  );
}

export default ClientSignUpPage;
