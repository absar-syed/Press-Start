const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); 
const cors = require('cors'); 
const app = express();
const PORT = 5000;

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());

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
