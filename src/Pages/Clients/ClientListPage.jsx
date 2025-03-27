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

  // Filter logic for the fields you want to match
  const filteredClients = clients.filter((item) => {
    // Convert the search input to lowercase once
    const searchTerm = search.toLowerCase();

    // Convert each field to lowercase safely (using "?." in case they're undefined)
    const clientFname = item.clients?.client_fname?.toLowerCase() || "";
    const clientLname = item.clients?.client_lname?.toLowerCase() || "";
    const clientEmail = item.clients?.client_email?.toLowerCase() || "";
    const employeeFname = item.employees?.employee_fname?.toLowerCase() || "";
    const employeeLname = item.employees?.employee_lname?.toLowerCase() || "";

    // Return true if *any* field contains the search term
    return (
      clientFname.includes(searchTerm) ||
      clientLname.includes(searchTerm) ||
      clientEmail.includes(searchTerm) ||
      employeeFname.includes(searchTerm) ||
      employeeLname.includes(searchTerm)
    );
  });

  // If user is typing, show filtered list; if no search term, show all
  const displayClients = search ? filteredClients : clients;

  return (
    <div>
      <Navbar />
      <section className="client-list-page">
        <h2>Client List</h2>

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
                <td>
                  {item.clients?.client_fname} {item.clients?.client_lname}
                </td>
                <td>{item.clients?.client_email}</td>
                <td>{item.receipt_date}</td>
                <td>
                  {item.employees?.employee_fname} {item.employees?.employee_lname}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ClientListPage;
