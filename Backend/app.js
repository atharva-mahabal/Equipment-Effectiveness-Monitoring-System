const express = require('express');
const sql = require('mssql');
const app = express();
const port = 5001;
const config = {
  user: 'Atharva',
  password: '123',
  server: 'localhost', 
  database: 'EEMS',
  options: {
    encrypt: true, // For secure connections
    trustServerCertificate: true, // Trust the self-signed certificate
  },
};

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query('select * from GaugeValues');

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


