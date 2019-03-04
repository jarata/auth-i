const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.get('/', (req, res) => {
    res.send("Test");
});

server.post('/api/register', async (req, res) => {
    res.send('Register POST')
});

server.post('/api/login', async (req, res) => {
    res.send('Login POST')
})

server.get('/api/users', async (req, res) => {
    res.send('Users GET')
})

module.exports = server;