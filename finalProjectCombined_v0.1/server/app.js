// app.js

// uses the .env file to configure the server and database connection
require('dotenv').config();


const express = require('express');
const path = require('path');
const authorize = require('./alltogether/authorize.js');
const login = require('./alltogether/login.js');
const onboarding = require('./alltogether/onboarding.js');
const tickets = require('./alltogether/tickets.js');
const new_ticket = require('./alltogether/new_ticket.js');
const emailAndSchedule = require('./alltogether/emailAndSchedule.js');
const notifications = require('./alltogether/notifications.js');


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Serve the Vue app
app.use(express.static(path.join(__dirname, '../client/dist')));


// uses the express.json() middleware to parse JSON request bodies
app.use(express.json());
app.use('/login', login);
app.use('/api', authorize);
app.use('/api/onboarding',authorize, onboarding);
app.use('/api/tickets', authorize, tickets);
app.use('/api/new_ticket', authorize, new_ticket);
app.use('/api/archive', authorize, tickets);
app.use('/api/notifications', authorize, notifications);



// Catch-all route to serve the Vue app for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for the 'setUserId' event to associate the socket with a user
    socket.on('setUserId', (userId) => {
        socket.userId = userId;



        // Call the newNotifications function with the connected user's ID
        emailAndSchedule.newNotifications(userId, io)
            .then(r => console.log('Notifications checked successfully'))
            .catch(e => console.error('Error checking notifications:', e));
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('localhost:3000/login  is live');
});