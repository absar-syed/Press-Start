import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import './RepairPage.css';

function RepairPage() {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    clientid: '',
    employeeid: '',
    repair_item: '',
    repair_issue: '',
    // We'll store the user input exactly as MM/DD/YY in this field.
    repair_start_date: '',
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/clients-list')
      .then(res => res.json())
      .then(result => setClients(result.data || []))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(result => setEmployees(result.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Basic approach: just store exactly what the user typed
    // You could also add logic to insert slashes automatically.
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const payload = { ...form };

      const res = await fetch('http://localhost:5000/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submit error');
      }

      alert('Repair submitted successfully!');
      setForm({
        clientid: '',
        employeeid: '',
        repair_item: '',
        repair_issue: '',
        repair_start_date: '',
      });
    } catch (err) {
      console.error('Error submitting repair:', err);
      alert('Failed to submit repair.');
    }
  };

  return (
    <div>
      <Navbar />
      <section className="repair-page">
        <h2>Repair Portal</h2>
        <form onSubmit={handleSubmit}>
          <label>Client</label>
          <select
            name="clientid"
            value={form.clientid}
            onChange={handleChange}
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.clientid} value={client.clientid}>
                {client.client_fname} {client.client_lname}
              </option>
            ))}
          </select>

          <label>Employee</label>
          <select
            name="employeeid"
            value={form.employeeid}
            onChange={handleChange}
            required
          >
            <option value="">Select an employee</option>
            {employees.map(emp => (
              <option key={emp.employeeid} value={emp.employeeid}>
                {emp.employee_fname} {emp.employee_lname}
              </option>
            ))}
          </select>

          <label>Repair Item</label>
          <input
            name="repair_item"
            value={form.repair_item}
            onChange={handleChange}
            required
          />

          <label>Description of Issue</label>
          <textarea
            name="repair_issue"
            value={form.repair_issue}
            onChange={handleChange}
            required
          />

          <label>Start Date (MM/DD/YY)</label>
          <input
            type="text"
            name="repair_start_date"
            placeholder="MM/DD/YY"
            pattern="^\d{2}/\d{2}/\d{2}$"  
            value={form.repair_start_date}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit Repair Request</button>
        </form>
      </section>
    </div>
  );
}

export default RepairPage;
