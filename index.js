  const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const app = express();
const port = 3000;

const mssqlConfig = {
  user: 'PMS',
  password: '123',
  server: 'localhost',
  database: 'PMS',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

async function executeQuery(query) {
  try {
    const pool = await sql.connect(mssqlConfig); 
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    throw error;
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    const query = 'select  * from customers'; // Replace with your table name
    const data = await executeQuery(query);
    res.render('index', { data });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});


//start insert data query

app.post('/insert', async (req, res) => {
  try {
      const pool = await sql.connect(mssqlConfig);
      const query = `
          INSERT INTO Customers (
              CustomerKey, Prefix, FirstName, LastName, BirthDate, MaritalStatus,
              Gender, EmailAddress, AnnualIncome, TotalChildren, EducationLevel,
              Occupation, HomeOwner
          )
          VALUES (
              @customerKey, @prefix, @firstName, @lastName, @birthDate, @maritalStatus,
              @gender, @emailAddress, @annualIncome, @totalChildren, @educationLevel,
              @occupation, @homeOwner
          );
      `;

      const params = {
          customerKey: req.body.customerKey,
          prefix: req.body.prefix,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          birthDate: req.body.birthDate,
          maritalStatus: req.body.maritalStatus,
          gender: req.body.gender,
          emailAddress: req.body.emailAddress,
          annualIncome: req.body.annualIncome,
          totalChildren: req.body.totalChildren,
          educationLevel: req.body.educationLevel,
          occupation: req.body.occupation,
          homeOwner: req.body.homeOwner,
      };

      await pool.request()
          .input('customerKey', sql.VarChar, params.customerKey)
          .input('prefix', sql.VarChar(10), params.prefix)
          .input('firstName', sql.VarChar(50), params.firstName)
          .input('lastName', sql.VarChar(50), params.lastName)
          .input('birthDate', sql.VarChar, params.birthDate)
          .input('maritalStatus', sql.VarChar(20), params.maritalStatus)
          .input('gender', sql.VarChar(10), params.gender)
          .input('emailAddress', sql.VarChar(100), params.emailAddress)
          .input('annualIncome', sql.VarChar(18, 2), params.annualIncome)
          .input('totalChildren', sql.VarChar, params.totalChildren)
          .input('educationLevel', sql.VarChar(50), params.educationLevel)
          .input('occupation', sql.VarChar(50), params.occupation)
          .input('homeOwner', sql.VarChar(3), params.homeOwner)
          .query(query);

      await pool.close();

      res.redirect('/');
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while inserting data');
  }
});


//end insert data query 

  // Route to handle updating an existing record
  app.post('/update/:CustomerKey', async (req, res) => {
    const { CustomerKey } = req.params;
    const { newName } = req.body; // Get the updated data from the form
    // Add other updated data as needed
  
    try {
      // Update the record in the database
      const query = `UPDATE Customers SET FirstName = '${newName}' WHERE CustomerKey = ${CustomerKey}`; // Adjust the SQL query as needed
      await executeQuery(query);
      res.redirect('/');
    } catch (error) {
      res.status(500).send('Error: ' + error.message);
    }
  });
  
  // Route to handle deleting a record
  app.post('/delete/:CustomerKey', async (req, res) => {
    const { CustomerKey } = req.params;
  
    try {
      // Delete the record from the database
      const query = `DELETE FROM Customers WHERE CustomerKey = ${CustomerKey}`; // Adjust the SQL query as needed
      await executeQuery(query);
      res.redirect('/');
    } catch (error) {
      res.status(500).send('Error: ' + error.message);
    }
  });
  
  // ...
  


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
