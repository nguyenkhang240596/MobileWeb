'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * Cart Schema
 */
var CartSchema = new Schema({
  productId : {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  quantity : Number,
  createdDate : {
    type: Date,
    default: Date.now
  }
}, { versionKey : false });

mongoose.model('Cart', CartSchema);
