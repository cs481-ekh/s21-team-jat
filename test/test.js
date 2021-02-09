var supertest = require("supertest");
var should = require("should");
var app = require("../app");
fs = require('fs');

// This agent refers to PORT where program is runninng.
var server = supertest.agent(app);

// Make sure that GET / returns the index page
describe("GET /", function() {
  it("renders index.ejs", function(done) {
    server.get("/")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        res.body.should.match(/<h1>Express<\/h1>/);
        done();
      });
  });
});

// Make sure that /users returns a table of users
// Make sure to change this in prod
describe("GET /users", function() {
  it("render users.ejs", function(done) {
    server.get("/")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        res.body.should.match(/<table id="user-table">/);
        done();
      });
  });
});