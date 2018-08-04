'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  CartItem = mongoose.model('CartItem'),
  Order = mongoose.model('Order'),
  Product = mongoose.model('Product');

function notifyErrror(res) {
  res.status(404).send({
    message: 'error'
  });
}

exports.getAllOrder = function (req, res) {
  var user = req.user;
  if (user) {
    Order.find({ status : { $in : [1,2 ] }}, (err, orders) => {
      if (!err && orders) {
        res.json(orders)
      } else {
        res.status(400).send({
          message: 'error'
        });
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


exports.getOrderDetails = function (req, res) {
  var user = req.user;
  var orderId = req.params.orderId ? req.params.orderId : ''
  console.log("order " + orderId)
  if (orderId) {
    CartItem.find({ orderId : orderId }, (err, cartItems) => {
      if (!err && cartItems) {
        CartItem.populate(cartItems, { path : 'productId' }, function (err, populatedData) {
          if (!err) {
            res.json(populatedData)
          }
        })
      } else {
        res.status(400).send({
          message: 'error'
        });
      }
    })
  } else {
    res.status(400).send({
      message: 'error'
    });
  }
};

exports.updateOrder = function (req, res) {
  var orderId = req.body.orderId ? req.body.orderId : ''
  var status = req.body.status ? req.body.status : ''
  if (orderId) {
    Order.findOne({ _id : orderId }, (err, order) => {
      if (!err && order) {
        order.status = status
        order.save()
        res.json(order)
      } else {
        res.status(400).send({
          message: 'error'
        });
      }
    })
  } else {
    res.status(400).send({
      message: 'Error'
    });
  }
};

