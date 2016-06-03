'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../model/user');
const basicHTTP = require('../lib/basic_http');

const router = module.exports = exports = express.Router();

router.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User(req.body);
  let hashedPassword = newUser.hashPassword();
  newUser.password = hashedPassword;
  req.body.password = null;
  User.findOne({username: req.body.username}, (err, user) => {
    if (err || user) return next(new Error('couldn not create user - one already exists or error'));
    newUser.save((err, user) => {
      if(err) return next(new Error('could not create user'));
      res.json({token: user.generateToken()});
    });
  });
});

router.get('/signin', basicHTTP, (req, res, next) => {
  User.findOne({username: req.auth.username}, (err, user) => {
    if(err || !user) return next(new Error('could not sign in - user does not exist'));
    if(!user.comparePassword(req.auth.password)) return next(new Error('could not sign in - password not valid'));
    res.json({token: user.generateToken()});
  });
});
