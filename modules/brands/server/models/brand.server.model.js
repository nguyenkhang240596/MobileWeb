'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Brand Schema
 */
var BrandSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Brand name',
    trim: true
  },
  image: String,
  tag: String,
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Brand', BrandSchema);
