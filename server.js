const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let users = [];

// Read users from JSON file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        users = [];
    }
};

// Write users to JSON file
const writeUsersToFile = () => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Fetch users from JSONPlaceholder
axios.get('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        users = response.data;
        writeUsersToFile(); // Guardar inicialmente en el archivo
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });

// Load users from file when server starts
readUsersFromFile();

// Get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Add a new user
app.post('/api/users', (req, res) => {
    const newUser = {
        ...req.body,
        id: users.length ? users[users.length - 1].id + 1 : 1 // Continuar el ID
    };
    users.push(newUser);
    writeUsersToFile(); // Guardar el nuevo usuario en el archivo
    res.json(newUser);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});