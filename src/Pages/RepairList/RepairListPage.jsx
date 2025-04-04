import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import './RepairListPage.css';

function RepairListPage() {
  const [repairs, setRepairs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://press-start-api.onrender.com/api/repairs')
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setRepairs(result.data);
        }
      })
      .catch((error) => console.error('Error fetching repairs:', error));
  }, []);

  // 1. Convert `search` to lowercase for case-insensitive matching
  // 2. Check the relevant fields (repair_item, client_fname, employee_fname)
  // 3. Return matches
  const filteredRepairs = repairs.filter((item) => {
    const searchTerm = search.toLowerCase();

    const repairItem = item.repair_item.toLowerCase();
    const clientFname = item.clients?.client_fname?.toLowerCase() || '';
    const employeeFname = item.employees?.employee_fname?.toLowerCase() || '';

    return (
      repairItem.includes(searchTerm) ||
      clientFname.includes(searchTerm) ||
      employeeFname.includes(searchTerm)
    );
  });

  // If there's something in `search`, display the filtered list; otherwise display all
  const displayRepairs = search ? filteredRepairs : repairs;

  return (
    <div>
      <Navbar />
      <section className="repair-list-page">
        <h2>Repair Orders</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search repair items, clients, or employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* This button is optional. Right now, filtering happens automatically onChange. */}
          <button>Search</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Issue</th>
              <th>Start Date</th>
              <th>Client</th>
              <th>Client Email</th>
              <th>Handled By</th>
            </tr>
          </thead>
          <tbody>
            {displayRepairs.map((item) => (
              <tr key={item.repairordersid}>
                <td>{item.repair_item}</td>
                <td>{item.repair_issue}</td>
                <td>{item.repair_start_date}</td>
                <td>
                  {item.clients?.client_fname} {item.clients?.client_lname}
                </td>
                <td>{item.clients?.client_email}</td>
                <td>{item.employees?.employee_fname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default RepairListPage;

