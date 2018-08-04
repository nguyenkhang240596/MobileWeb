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
var OrderSchema = new Schema({
  userId : {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status : {
    type : Number,
    default : 0
  },
  userName : String,
  phoneNumber : String,
  fullAddress : String,
  totalPrice : Number,
  shippingPrice : Number,
  createdDate : {
    type: Date,
    default: Date.now
  }
}, { versionKey : false });

mongoose.model('Order', OrderSchema);
