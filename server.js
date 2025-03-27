const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import path module

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017/getDB';

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Schema
const schema = new mongoose.Schema({
    name: String,
    email: String,
    msg: String
});

// Create Model
const User = mongoose.model('User', schema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname))); // Serve files from the project directory

// Route to serve contact.html
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html')); // Serve the contact.html file
});

// Route to serve login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Serve the login.html file
});

// Root Route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Express Server!</h1><p>Use <a href="/contact">Contact Us</a> or <a href="/login">Login</a> to access the forms.</p>');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received Data:', data);

        const newUser = new User(data);
        await newUser.save();

        console.log('Data saved successfully');
        res.status(200).send('Data saved successfully');
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Error saving data to database');
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});