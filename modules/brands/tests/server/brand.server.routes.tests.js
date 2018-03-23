'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Brand = mongoose.model('Brand'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  brand;

/**
 * Brand routes tests
 */
describe('Brand CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Brand
    user.save(function () {
      brand = {
        name: 'Brand name'
      };

      done();
    });
  });

  it('should be able to save a Brand if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Brand
        agent.post('/api/brands')
          .send(brand)
          .expect(200)
          .end(function (brandSaveErr, brandSaveRes) {
            // Handle Brand save error
            if (brandSaveErr) {
              return done(brandSaveErr);
            }

            // Get a list of Brands
            agent.get('/api/brands')
              .end(function (brandsGetErr, brandsGetRes) {
                // Handle Brands save error
                if (brandsGetErr) {
                  return done(brandsGetErr);
                }

                // Get Brands list
                var brands = brandsGetRes.body;

                // Set assertions
                (brands[0].user._id).should.equal(userId);
                (brands[0].name).should.match('Brand name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Brand if not logged in', function (done) {
    agent.post('/api/brands')
      .send(brand)
      .expect(403)
      .end(function (brandSaveErr, brandSaveRes) {
        // Call the assertion callback
        done(brandSaveErr);
      });
  });

  it('should not be able to save an Brand if no name is provided', function (done) {
    // Invalidate name field
    brand.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Brand
        agent.post('/api/brands')
          .send(brand)
          .expect(400)
          .end(function (brandSaveErr, brandSaveRes) {
            // Set message assertion
            (brandSaveRes.body.message).should.match('Please fill Brand name');

            // Handle Brand save error
            done(brandSaveErr);
          });
      });
  });

  it('should be able to update an Brand if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Brand
        agent.post('/api/brands')
          .send(brand)
          .expect(200)
          .end(function (brandSaveErr, brandSaveRes) {
            // Handle Brand save error
            if (brandSaveErr) {
              return done(brandSaveErr);
            }

            // Update Brand name
            brand.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Brand
            agent.put('/api/brands/' + brandSaveRes.body._id)
              .send(brand)
              .expect(200)
              .end(function (brandUpdateErr, brandUpdateRes) {
                // Handle Brand update error
                if (brandUpdateErr) {
                  return done(brandUpdateErr);
                }

                // Set assertions
                (brandUpdateRes.body._id).should.equal(brandSaveRes.body._id);
                (brandUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Brands if not signed in', function (done) {
    // Create new Brand model instance
    var brandObj = new Brand(brand);

    // Save the brand
    brandObj.save(function () {
      // Request Brands
      request(app).get('/api/brands')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Brand if not signed in', function (done) {
    // Create new Brand model instance
    var brandObj = new Brand(brand);

    // Save the Brand
    brandObj.save(function () {
      request(app).get('/api/brands/' + brandObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', brand.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Brand with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/brands/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Brand is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Brand which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Brand
    request(app).get('/api/brands/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Brand with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Brand if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Brand
        agent.post('/api/brands')
          .send(brand)
          .expect(200)
          .end(function (brandSaveErr, brandSaveRes) {
            // Handle Brand save error
            if (brandSaveErr) {
              return done(brandSaveErr);
            }

            // Delete an existing Brand
            agent.delete('/api/brands/' + brandSaveRes.body._id)
              .send(brand)
              .expect(200)
              .end(function (brandDeleteErr, brandDeleteRes) {
                // Handle brand error error
                if (brandDeleteErr) {
                  return done(brandDeleteErr);
                }

                // Set assertions
                (brandDeleteRes.body._id).should.equal(brandSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Brand if not signed in', function (done) {
    // Set Brand user
    brand.user = user;

    // Create new Brand model instance
    var brandObj = new Brand(brand);

    // Save the Brand
    brandObj.save(function () {
      // Try deleting Brand
      request(app).delete('/api/brands/' + brandObj._id)
        .expect(403)
        .end(function (brandDeleteErr, brandDeleteRes) {
          // Set message assertion
          (brandDeleteRes.body.message).should.match('User is not authorized');

          // Handle Brand error error
          done(brandDeleteErr);
        });

    });
  });

  it('should be able to get a single Brand that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Brand
          agent.post('/api/brands')
            .send(brand)
            .expect(200)
            .end(function (brandSaveErr, brandSaveRes) {
              // Handle Brand save error
              if (brandSaveErr) {
                return done(brandSaveErr);
              }

              // Set assertions on new Brand
              (brandSaveRes.body.name).should.equal(brand.name);
              should.exist(brandSaveRes.body.user);
              should.equal(brandSaveRes.body.user._id, orphanId);

              // force the Brand to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Brand
                    agent.get('/api/brands/' + brandSaveRes.body._id)
                      .expect(200)
                      .end(function (brandInfoErr, brandInfoRes) {
                        // Handle Brand error
                        if (brandInfoErr) {
                          return done(brandInfoErr);
                        }

                        // Set assertions
                        (brandInfoRes.body._id).should.equal(brandSaveRes.body._id);
                        (brandInfoRes.body.name).should.equal(brand.name);
                        should.equal(brandInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Brand.remove().exec(done);
    });
  });
});
