var supertest = require("supertest");
var should = require("should");
var app = require("../app");
fs = require('fs');

// This agent refers to PORT where program is runninng.
var server = supertest.agent(app);

// All GET methods before authentication
describe("GET methods, no auth", function () {
  it("returns a 404", function (done) {
    server.get("/lkamnsdnf")
      .expect("Content-type", /text\/html/)
      .expect(404)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(404);
        done();
      });
  });

  it("renders index.ejs", function (done) {
    server.get("/")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("renders login.ejs", function (done) {
    server.get("/login")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("redirects to /login on /users with no auth", function (done) {
    server.get("/users")
      .expect(302)
      .expect('Location', '/login')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });

  it("redirects to /login on /dashboard with no auth", function (done) {
    server.get("/dashboard")
      .expect(302)
      .expect('Location', '/login')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });

});

// Testing /auth
describe("Auth testing", function () {
  it("renders login.ejs on bad username", function (done) {
    server.post("/auth")
      .send({
        Username: "aidan1",
        Password: "testpassword"
      })
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("renders login.ejs on bad password", function (done) {
    server.post("/auth")
      .send({
        Username: "aidan",
        Password: "testpassword1"
      })
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("good auth redirects to dashboard.ejs", function (done) {
    server.post("/auth")
      .send({
        Username: "aidan",
        Password: "testpassword"
      })
      .redirects(1)
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });
});

// Testing authorization
describe("GET methods, valid auth", function () {
  it("renders /users", function (done) {
    server.get("/users")
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("renders /dashboard", function (done) {
    server.get("/dashboard")
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });
});

// Testing log out
describe("Log out", function () {
  it("logs the user out", function (done) {
    server.get("/auth/logout")
      .expect(302)
      .expect('Location', '/')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });

  it("ensures no access after log out", function (done) {
    server.get("/users")
      .expect(302)
      .expect('Location', '/login')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });
});

// Error testing
describe("Error testing after logout", function () {

  beforeEach(function () {
    fs.rename("users.json", "users1.json", function () {

    });
  });

  it("throws error on bad filename", function (done) {
    server.post("/auth")
      .send({
        Username: "aidan",
        Password: "testpassword"
      })
      .expect(500)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(500);
        done();
      });
  });

  afterEach(function () {
    fs.rename("users1.json", "users.json", function () {

    });
  });
});