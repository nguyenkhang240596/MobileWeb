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

exports.addProductToUser = function (req, res) {
  // Init Variables
  var user = req.user;
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  let productId = req.body.productId || ''

  // let userId = user._id
  let userId = req.body.userId || user._id
  if (userId && productId) {
    // status : 0 -> ordering, 1 -> checkout, 2 -> delivered
    Order.findOne({ userId : userId, status : 0 }, (err, order) => {
      if (err) notifyErrror(res)
      else {
        if (order) {
          console.log({ orderId : order._id, productId : productId })
          CartItem.findOne({ orderId : order._id, productId : productId }, (err, cartItem) => {
            if (err) notifyErrror(res)
            else {
              if (cartItem) {
                cartItem.quantity += 1
                cartItem.save(err => { 
                  if (err) notifyErrror(res)
                  else {
                    res.status(200).send({
                      message: 'Success'
                    });
                  }
                })
              } else {
                var newCartItem = new CartItem()
                newCartItem.quantity = 1
                newCartItem.orderId = order._id
                newCartItem.productId = productId
                newCartItem.save(err => { 
                  if (err) notifyErrror(res)
                  else {
                    res.status(200).send({
                      message: 'Success'
                    });
                  }
                })
              }
            }
          })
        } else {
          var newOrder = new Order()
          newOrder.userId = userId

          var newCartItem = new CartItem()
          newCartItem.quantity = 1
          newCartItem.orderId = newOrder._id
          newCartItem.productId = productId
          newCartItem.save(err => { 
            if (err) notifyErrror(res)
            else {
              newOrder.save()
              res.status(200).send({
                message: 'Success'
              });
            }
          })
        }
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.getUserCart = function (req, res) {
  var user = req.user;
  let userId = user._id
  if (user) {
    Order.findOne({ userId : userId, status : 0 }, (err, order) => {
      if (!err && order) {
       CartItem.find({ orderId : order._id },
        (err, cartItems) => {
          if (!err) {
            CartItem.populate(cartItems, { path : 'productId' }, function (err, populatedData) {
              if (!err) {
                res.json(populatedData)
              }
            })
          }
        })
      } else {
         res.json([])
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.updateCart = function (req, res) {
  var user = req.user;
  if (user) {
    user.cart = req.body.cart
    user.save(err => {
      if (err) res.status(400).send({ message : 'error' })
      else res.json(user.cart) 
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.removeCartItem = function (req, res) {
  var cartId = req.body.cartId || '';
  if (cartId) {
    CartItem.findOneAndRemove({ _id : cartId }, (err) => {
      if (!err) {
        res.status(200).send({ message : 'success' })
      }
    })
  } else {
    res.status(400).send({
      message: 'error'
    });
  }
};


exports.addQuantity = function (req, res) {
  var user = req.user;
  var cartId = req.body.cartId;
  if (user) {
    CartItem.findOne({ _id : cartId}, (err, cart) => {
      cart.quantity++;
      cart.save(err => {
        if (err) res.status(400).send({ message : 'error' })
        else res.json(cart) 
      })
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.subQuantity = function (req, res) {
  var user = req.user;
  var cartId = req.body.cartId;
  if (user) {
    CartItem.findOne({ _id : cartId}, (err, cart) => {
      cart.quantity--;
      cart.save(err => {
        if (err) res.status(400).send({ message : 'error' })
        else res.json(cart) 
      })
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


exports.createOrder = function (req, res) {
  var userId = req.body.userId ? req.body.userId : ''
  var fullAddress = req.body.fullAddress ? req.body.fullAddress : ''
  var userName = req.body.userName ? req.body.userName : ''
  var phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : ''
  var totalPrice = req.body.totalPrice ? req.body.totalPrice : 0
  var shippingPrice = req.body.shippingPrice ? req.body.shippingPrice : 0

  console.log(userId, fullAddress)
  if (userId && fullAddress && userName && phoneNumber) {
    Order.findOne({ userId : userId, status : 0 },
    (err, order) => {
      if (err) console.log('error update create order')
      else {
        order.status = 1
        order.fullAddress = fullAddress
        order.userName = userName
        order.phoneNumber = phoneNumber
        order.totalPrice = totalPrice
        order.shippingPrice = shippingPrice
        order.save(err => {
          if (!err) {
            res.status(200).send({
              message: 'Done order for user ' + userId
            });
          }
        })
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

