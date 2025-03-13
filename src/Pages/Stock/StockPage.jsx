import { useState, useEffect } from 'react';


function StockPage() {

  return (
    <section className="stock-page">
      <h2>Look Up Inventory</h2>
      <input 
        type="text" 
        placeholder="Search item types, titles, or conditions..."
        
      />
      <button>Search</button>

      <table>
        <thead>
          <tr>
            <th>Item Type</th>
            <th>Title</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </section>
  );


}
export default StockPage;
