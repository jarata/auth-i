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
server.use(cors());

server.get('/', (req, res) => {
    res.send("Test");
});

server.post('/api/register', async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;
    try {
        let newUser = await db('users').insert(user)
        res.status(201).json(newUser)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "Error"
        })
    }
});

server.post('/api/login', async (req, res) => {
    res.send('Login POST')
});

server.get('/api/users', async (req, res) => {
    res.send('Users GET')
});

module.exports = server;