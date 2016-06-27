'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const mongoose = require('mongoose');
const basicHttp = require('../lib/basic_http');

chai.use(chaiHTTP);

const expect = chai.expect;
const request = chai.request;


process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';
require('../server.js');

describe('User tests', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should respond with 404 to bad path', (done) => {
    request('localhost:3000')
    .get('/badpath')
    .end((err, res) => {
      expect(err).to.not.eql(null);
      expect(res).to.have.status(404);
      expect(res.body).to.eql({message: 'not found'});
      done();
    });
  });

  it('should have a token', (done) => {
    request('localhost:3000')
    .post('/signup')
    .send({username: 'jeff', password: 'cats'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('token');
      done();
    });
  });
});

describe('Unit tests for auth', () => {
  it('should auth a user', () => {
    let baseString = new Buffer('jeff:cats').toString('base64');
    let authString = 'Basic ' + baseString;
    let req = {headers:{authorization: authString}};
    basicHttp(req, {}, () => {
      expect(req.auth).to.eql({username: 'jeff', password: 'cats'});
    });
  });
});
