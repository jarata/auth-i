const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

// Cookie
const cookieConfig = {
    name: 'session',
    secret: 'auth II',
    cookie: {
        maxAge: 120000,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
};

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(session(cookieConfig));

server.get('/', (req, res) => {
    res.send("Test");
});

server.post('/api/register', async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;
    try {
        let newUser = await db('users').insert(user);
        res.status(201).json(newUser)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "Error 500", e
        })
    }
});

server.post('/api/login', async (req, res) => {
    // res.send('Login POST')
    let {username, password} = req.body;
    try {
        let user = await db('users').where({username}).first();
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json({
                message: 'Welcome'
            })
        } else {
            res.status(401).json({
                message: 'Invalid credentials'
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: 'Error 500', e
        })
    }
});

function restricted (req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({
            error: "No logged in"
        })
    }
}

server.get('/api/users', restricted, async (req, res) => {
    try {
        const users = await db('users').select('id', 'username', 'password');
        res.status(200).json(users)
    } catch (e) {
        console.log(e);
        res.status(500).json(e)
    }
});

module.exports = server;