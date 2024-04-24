// app.js

// uses the .env file to configure the server and database connection
require('dotenv').config();


const express = require('express');
const path = require('path');
const authorize = require('./alltogether/authorize.js');
const login = require('./alltogether/login.js');
const onboarding = require('./alltogether/onboarding.js');
const tickets = require('./alltogether/tickets.js');

const app = express();

// Serve the Vue app
app.use(express.static(path.join(__dirname, '../client/dist')));


// uses the express.json() middleware to parse JSON request bodies
app.use(express.json());
app.use('/login', login);
app.use('/api', authorize);
app.use('/api/onboarding',authorize, onboarding);
app.use('/api/tickets', authorize, tickets);


// Catch-all route to serve the Vue app for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('localhost:3000/login  is live');
});