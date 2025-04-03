// ClientListPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientListPage.css';
import Navbar from '../../Components/Navbar';

function ClientListPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
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
    const clientFname = item.client_fname?.toLowerCase() || "";
    const clientLname = item.client_lname?.toLowerCase() || "";
    const clientEmail = item.client_email?.toLowerCase() || "";
    const clientUsername = item.client_username?.toLowerCase() || "";
    const clientPhone = item.client_phone?.toLowerCase() || "";
    const clientID = String(item.clientid).toLowerCase() || "";


    return (
      clientFname.includes(searchTerm) ||
      clientLname.includes(searchTerm) ||
      clientEmail.includes(searchTerm) ||
      clientID.includes(searchTerm) ||
      clientUsername.includes(searchTerm) ||
      clientPhone.includes(searchTerm)
    );
  });

  const displayClients = search ? filteredClients : clients;

  // delete client
  const deleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'DELETE'
      });
 
      if (!res.ok) throw new Error('Delete failed');
      
      setClients((prevClients) => prevClients.filter((client) => client.clientid !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting client.");
    }};
  
    // update client
    const updateClient = async () => {
      if (!selectedClient) return;
    
      try {
        const res = await fetch(`http://localhost:5000/api/clients/${selectedClient.clientid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedClient)
        });
    
        if (!res.ok) throw new Error('Update failed');
    
        // Update state
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.clientid === selectedClient.clientid ? selectedClient : client
          )
        );
    
        alert('Client updated successfully');
      } catch (err) {
        console.error(err);
        alert('Error updating client.');
      }
    };
    

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
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>ClientID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayClients.map((item) => (
              <tr key={item.clientid}>
                <td>{item.clientid}</td>
                <td>{item.client_fname} {item.client_lname}</td>
                <td>{item.client_username}</td>
                <td>{item.client_email}</td>
                <td>{item.client_phone}</td>
                <td className="text-nowrap">
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => setSelectedClient(item)}>Update</button>
                    <button className="btn btn-danger" onClick={() => deleteClient(item.clientid)}>Delete</button>
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
              <h5 className="modal-title" id="editModalLabel">Edit Client Information</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <label>ClientID (Read-Only)</label>
            <input className="form-control" name="clientid" type="text"  value={selectedClient?.clientid} readOnly/>

            <label>First Name</label>
            <input className="form-control" name="clientname" type="text" value={selectedClient?.client_fname || ''} onChange={(e) => setSelectedClient({ ...selectedClient, client_fname: e.target.value })}/>

            <label>Last Name</label>
            <input className="form-control" name="clientname" type="text" value={selectedClient?.client_lname || ''} onChange={(e) => setSelectedClient({ ...selectedClient, client_lname: e.target.value })}/>

            <label>Username</label>
            <input className="form-control" name="clientusername" type="text" value={selectedClient?.client_username || ''} onChange={(e) => setSelectedClient({ ...selectedClient, client_username: e.target.value })}/>

            <label>Email</label>
            <input className="form-control" name="clientemail" type="email" required value={selectedClient?.client_email || ''} onChange={(e) => setSelectedClient({ ...selectedClient, client_email: e.target.value })}/>

            <label>Phone Number</label>
            <input className="form-control" name="clientphone" type="number" min='1' max='9999999999' value={selectedClient?.client_phone || ''} onChange={(e) => setSelectedClient({ ...selectedClient, client_phone: e.target.value })}/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={updateClient}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    
  );
}

export default ClientListPage;
