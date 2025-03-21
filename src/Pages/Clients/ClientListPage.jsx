import { useState } from 'react';
import './ClientListPage.css';

function ClientListPage() {
  return (
    <section className="client-list-page">
      <h2>Client List</h2>
      <input
        type="text"
        placeholder="Search customer names or IDs..."
      />
      <button>Search</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Purchase History</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </section>
  );
}

export default ClientListPage;
