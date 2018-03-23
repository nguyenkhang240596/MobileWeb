'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Brand = mongoose.model('Brand'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Brand
 */
exports.create = function(req, res) {
  var brand = new Brand(req.body);
  brand.user = req.user;

  brand.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(brand);
    }
  });
};

/**
 * Show the current Brand
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var brand = req.brand ? req.brand.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  brand.isCurrentUserOwner = req.user && brand.user && brand.user._id.toString() === req.user._id.toString();

  res.jsonp(brand);
};

/**
 * Update a Brand
 */
exports.update = function(req, res) {
  var brand = req.brand;

  brand = _.extend(brand, req.body);

  brand.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(brand);
    }
  });
};

/**
 * Delete an Brand
 */
exports.delete = function(req, res) {
  var brand = req.brand;

  brand.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(brand);
    }
  });
};

/**
 * List of Brands
 */
exports.list = function(req, res) {
  Brand.find().sort('-created').populate('user', 'displayName').exec(function(err, brands) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(brands);
    }
  });
};

/**
 * Brand middleware
 */
exports.brandByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Brand is invalid'
    });
  }

  Brand.findById(id).populate('user', 'displayName').exec(function (err, brand) {
    if (err) {
      return next(err);
    } else if (!brand) {
      return res.status(404).send({
        message: 'No Brand with that identifier has been found'
      });
    }
    req.brand = brand;
    next();
  });
};
