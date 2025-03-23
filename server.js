const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Enable CORS for your React client (adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure express-session middleware
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up PostgreSQL connection pool using Supabase connection string (session pool)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g., your session pool connection string
  ssl: { rejectUnauthorized: false },
});

const authenticateUser = async (username, password) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Employees WHERE Employee_username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const employee = result.rows[0];
    const isValid = await bcrypt.compare(password, employee.employee_password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    return employee;
  } catch (error) {
    console.error("authenticateUser error:", error.message);
    throw error;
  }
};



// Configure Passport's Local Strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await authenticateUser(username, password);
      return done(null, user);
    } catch (err) {
      return done(null, false, { message: err.message });
    }
  }
));

// Serialize the employee to store in the session (using the primary key)
passport.serializeUser((user, done) => {
  done(null, user.employeeid); // or user.employeeid if it’s lowercase
});


// Deserialize the employee from the session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM Employees WHERE EmployeeID = $1', [id]);
    if (result.rows.length === 0) {
      return done(new Error('User not found'));
    }
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

// Login route using Passport Local Strategy
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully', user: req.user });
});

// Protected profile endpoint
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  return res.status(401).json({ error: "Not authenticated." });
});


// Logout route to terminate the session
app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Initialize Supabase client (for other API endpoints)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Example endpoint to fetch inventory data from Supabase
app.get('/api/inventory', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
