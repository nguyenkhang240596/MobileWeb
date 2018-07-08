'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cart Schema
 */
var CommentSchema = new Schema({
  facebookId : String,
  senderName : String,
  commentId : String,
  content : String,
  created_time : {
    type: Date,
    default: Date.now
  }
}, { versionKey : false });

mongoose.model('Comment', CommentSchema);
