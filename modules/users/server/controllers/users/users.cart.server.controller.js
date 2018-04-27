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
  Cart = mongoose.model('Cart'),
  Product = mongoose.model('Product');

exports.addProductToUser = function (req, res) {
  // Init Variables
  var user = req.user;
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  let productId = req.body.productId
  if (user) {
    Cart.populate(user, { path : 'cart' }, function (err, user) {
      Product.populate(user, { path : 'cart.productId' }, function (err, user) {
        if (!err && user) exec(user)
      })
    });
    function exec(user) {
      let carts = user.cart;
      let cart = null;
      for (var i in carts) {
        if (carts[i].productId)
          console.log(carts[i].productId._id, productId)
        if (carts[i].productId && carts[i].productId._id == productId) {
          console.log(user.cart, "we found it")
          cart = carts[i];
          cart.quantity++;
          break;
        }
      }
      var userCart = user.cart || [];
      if (!cart) {
        cart = new Cart();
        cart.productId = productId;
        cart.quantity = 1;
        userCart.push(cart);
      } 

      user.cart = userCart;
      user.save(err => {
        if (err) {
          res.status(400).send(err);
        } else {
          cart.save(err => {
            if (err) res.status(400).send(err);
            else res.json(user);
          });
        }
      })
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.getUserCart = function (req, res) {
  var user = req.user;
  if (user) {
    Cart.populate(user, { path : 'cart' }, function (err, user) {
      Product.populate(user, { path : 'cart.productId' }, function (err, user) {
        res.json(user.cart)
      })
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


exports.addQuantity = function (req, res) {
  var user = req.user;
  var cartId = req.body.cartId;
  if (user) {
    Cart.findOne({ _id : cartId}, (err, cart) => {
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
    Cart.findOne({ _id : cartId}, (err, cart) => {
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

