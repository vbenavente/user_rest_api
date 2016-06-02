'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./route/auth_routes');
const jwtAuth = require('./lib/jwt_auth');

mongoose.connect('mongodb://localhost/dev_db');

app.use('/', authRouter);

app.get('/test', (req, res) => {
  res.send('no token necessary');
});

app.post('/test', bodyParser, jwtAuth, (req, res) => {
  res.json({message: 'token needed', user: req.user});
});

app.use((err, req, res, next) => {
  res.status(500).json({message: err.message});
  next(err);
});

app.listen(3000);
