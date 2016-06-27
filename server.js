'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./route/auth_routes');

mongoose.connect('mongodb://localhost/dev_db');

app.use('/', authRouter);

app.use((err, req, res, next) => {
  res.status(500).json({message: err.message});
  next(err);
});

app.use('*', (req,res) => {
  res.status(404).json({message: 'not found'});
});

app.listen(3000);
