import { useState } from 'react';
import Navbar from '../../Components/Navbar';
import './RepairPage.css';
function RepairPage() {


  return (
    <div>
    <Navbar />
    <section className="repair-page">
    
      <h2>Repair Portal</h2>
      <form >
        <label>Name</label>
        <input name="name"/>
        
        <label>Email</label>
        <input name="email"/>
        
        <label>Phone</label>
        <input name="phone" />
        
        <label>Console Type</label>
        <input name="consoleType"  />
        
        <label>Model</label>
        <input name="model" />
        
        <label>Description of Issue</label>
        <textarea name="issue" />
        
        <label>Dropoff Date</label>
        <input type="date"/>
        
        <button type="submit">Submit Repair Request</button>
      </form>
    </section>
    </div>
  );

}
export default RepairPage;
