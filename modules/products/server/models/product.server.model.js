'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  price : Number,
  image : String,
  brand : {
    type: Schema.ObjectId,
    ref: 'Brand'
  },
  created: {
    type: Date,
    default: Date.now
  }, 
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Product', ProductSchema);
