'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Comment = mongoose.model('Comment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.listComments = function(req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};
  let productId = product._id;
  Comment.find({ productId : productId, sentiment : { $in : ['câu khen', 'câu chê'] } }, (err, comments) => {
    if (!err) {
      console.log(comments)
      res.jsonp(comments);
    } else {
      console.log(err)
    }
  })
};

