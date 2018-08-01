'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Webhook
 */
exports.webHook = function (req, res) {
  console.log(req.query['hub.verify_token'], req.query['hub.verify_token'] === 'my_password')
    if (req.query['hub.verify_token'] === 'my_password') {
      return res.send(req.query['hub.challenge'])
    }
    return res.send('wrong token,error')
};

// to post data
exports.receiveDataWebHook = function (req, res) {

  console.log(req.body)
  let changes_events = req.body.entry[0].changes
    for (let i = 0; i < changes_events.length; i++) {
      let event = req.body.entry[0].changes[i]
      let val = event.value
      if (val.message) {
        var comment = new Comment()
        comment.facebookId = val.from.id
        comment.senderName = val.from.name
        comment.commentId = val.id
        comment.content = val.message
        comment.created_time = val.created_time
        comment.save(err => {
          if (err) console.log("error save comment")
          else {
            console.log("successful save comment")
          }
        });
        console.log(comment)
      }
    }

  function analysisSentiment() {
    var http = require('http');
    var post_data = JSON.stringify({
        'sentence' : 'pin quá trâu'
    });

    var post_options = {
        host: 'semanticapipython.herokuapp.com',
        port: '80',
        // path: '/webhook',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
    post_req.write(post_data);
    post_req.end();
  }
  
  res.sendStatus(200)
}


/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
