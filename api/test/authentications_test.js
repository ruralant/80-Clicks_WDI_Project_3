process.env.NODE_ENV = 'test';

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

var app = require('../app');
var api = supertest(app);

var User = require('../models/user');

describe("Auth tests", function() {
  
  this.timeout(5000);

  beforeEach(function(done) {
    User.collection.drop();
    done();
  });

  describe("POST /api/register with good credentials", function() {

    it("should return a token", function(done) {
      api.post('/api/register')
        .set("Accept", "application/json")
        .send({
          username: "test",
          email: "test@test.com",
          password: "password",
          passwordConfirmation: "password"
        }).end(function(err, res) {
          expect(res.body.token).to.be.a('string');
          done();
        });
    });
  });

  describe("POST /api/register with bad credentials", function() {
    it("should return a 400 response", function(done) {
      api.post('/api/register')
        .set("Accept", "application/json")
        .send({
          username: "test",
          email: "test@test.com",
        }).expect(400, done);
    });
  });

  describe("POST /api/login with good credentials", function(done) {

    it("should return a token", function(done) {
      var user = new User({
        username: "test",
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password"
      });

      user.save(function(err, user) {
        api.post('/api/login')
          .set("Accept", "application/json")
          .send({
            email: "test@test.com",
            password: "password"
          }).end(function(err, res) {
            expect(res.body.token).to.be.a('string');
            done();
          });
      });
    });
  });

  describe("POST /api/login with bad credentials", function(done) {

    it("should return a 401 response", function(done) {
      var user = new User({
        username: "test",
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password"
      });

      user.save(function(err, user) {
        api.post('/api/login')
          .set("Accept", "application/json")
          .send({
            email: "test@test.com",
            password: "pass"
          }).expect(401, done);
      });
    });
  });
});