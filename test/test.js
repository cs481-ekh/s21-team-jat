var supertest = require("supertest");
var should = require("should");
var app = require("../app");
fs = require('fs');

// This agent refers to PORT where program is runninng.
var server = supertest.agent(app);

// Express test, used for verifying test action
describe("GET /", function() {
  it("render index.ejs", function(done) {
    server.get("/")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });
});