import { useState, useEffect } from 'react';
import './ClientListPage.css';
import Navbar from '../../Components/Navbar';

function ClientListPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

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
    return (
      item.clients?.client_fname.toLowerCase().includes(searchTerm) ||
      item.employees?.employee_fname.toLowerCase().includes(searchTerm)
    );
  });

  const displayClients = search ? filteredClients : clients;

  return (
    <div>
      <Navbar />
      <section className="client-list-page">
        <h2>Client List</h2>
        <input
          type="text"
          placeholder="Search customer names or employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Search</button>

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
                <td>{item.employees?.employee_fname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ClientListPage;
