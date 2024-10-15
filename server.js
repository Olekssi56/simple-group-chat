const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',  // Change if necessary
    user: 'root',       // Change if necessary
    password: '',       // Change if necessary
    database: 'calm'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// API to add a message to the database
app.post('/addMessage', (req, res) => {
    const { initial, message } = req.body;

    if (!initial || !message) {
        return res.status(400).json({ error: 'Initial and message are required' });
    }

    const query = 'INSERT INTO message (initial, message, create_time) VALUES (?, ?, NOW())';
    db.query(query, [initial, message], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).json({ error: 'Failed to insert message' });
        }
        res.json({ success: true, messageId: result.insertId });
    });
});

// API to get the message list from the database
app.get('/getMessageList', (req, res) => {
    const query = 'SELECT initial, message, create_time FROM message ORDER BY create_time DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
