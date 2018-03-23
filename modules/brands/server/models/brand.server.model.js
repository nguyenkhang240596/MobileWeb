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
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Brand', BrandSchema);
