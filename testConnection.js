const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g., your connection string from the .env file
  ssl: { rejectUnauthorized: false },
});

const testQuery = async () => {
  try {
    // Query the Employees table for the EmployeeID, Employee_username, and Employee_password columns
    const result = await pool.query(`
      SELECT EmployeeID, Employee_username, Employee_password 
      FROM Employees;
    `);

    console.log("Employees:", result.rows);
  } catch (err) {
    console.error("Error querying Employees table:", err);
  } finally {
    pool.end();
  }
};

testQuery();
