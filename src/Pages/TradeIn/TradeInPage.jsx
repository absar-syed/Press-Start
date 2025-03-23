import { useState } from 'react';
import Navbar from '../../Components/Navbar';
import './TradeInPage.css';
function TradeInPage() {

  return (
    <div>
    <Navbar/>
    <section className="trade-in-page">
      <h2>Trade-In Inventory</h2>
      <input
        type="text"
        placeholder="Search item titles, market values..."
      />
      <button>Search</button>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Market Value</th>
            <th>Trade-In Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </section>
    </div>
  );
}

export default TradeInPage;
