// Shows table of all clients from receipts
// Includes search and signup button

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientListPage.css';
import Navbar from '../../Components/Navbar';

function ClientListPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/clients')
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setClients(result.data);
        }
      })
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  const filteredClients = clients.filter((item) => {
    const searchTerm = search.toLowerCase();
    const clientFname = item.clients?.client_fname?.toLowerCase() || "";
    const clientLname = item.clients?.client_lname?.toLowerCase() || "";
    const clientEmail = item.clients?.client_email?.toLowerCase() || "";
    const employeeFname = item.employees?.employee_fname?.toLowerCase() || "";
    const employeeLname = item.employees?.employee_lname?.toLowerCase() || "";

    return (
      clientFname.includes(searchTerm) ||
      clientLname.includes(searchTerm) ||
      clientEmail.includes(searchTerm) ||
      employeeFname.includes(searchTerm) ||
      employeeLname.includes(searchTerm)
    );
  });

  const displayClients = search ? filteredClients : clients;

  return (
    <div>
      <Navbar />
      <section className="client-list-page">
        <h2>Client List</h2>

        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => navigate('/clients-sign-up')}>Sign Up New Client</button>
        </div>

        <input
          type="text"
          placeholder="Search clients or employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Email</th>
              <th>Purchase Date</th>
              <th>Handled By</th>
            </tr>
          </thead>
          <tbody>
            {displayClients.map((item) => (
              <tr key={item.receiptid}>
                <td>{item.clients?.client_fname} {item.clients?.client_lname}</td>
                <td>{item.clients?.client_email}</td>
                <td>{item.receipt_date}</td>
                <td>{item.employees?.employee_fname} {item.employees?.employee_lname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ClientListPage;