const express = require('express');

const API = express.Router();

API.get('/', (req, res) => {
    res.send(`Hello from APIv1 root route. ${req.app.get('test')}`);
    req.app.set('test', 'what is this?!')
});

API.get('/users', (req, res) => {
    res.send('List of APIv1 users.');
});

API.get('/led/toggle', (req, res) => {
    res.status(200).json({ message: 'Succeed'})
})

module.exports = API;
