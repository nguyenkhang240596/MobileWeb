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


const https = require('https');
var Regex = require("regex");

// to post data
exports.receiveDataWebHook = function (req, res) {
  let changes_events = req.body.entry[0].changes
    for (let i = 0; i < changes_events.length; i++) {
      let event = req.body.entry[0].changes[i]
      let val = event.value
      if (val.message) {
          let commentId = val.id
          let sentence = val.message
          getProductId(commentId, (productId) => {
              callApiAnalysisSentiment(sentence, commentId, (sentimentAnalyzed) => {
                  var comment = new Comment()
                  comment.facebookId = val.from.id
                  comment.senderName = val.from.name
                  comment.productId = productId
                  comment.commentId = commentId
                  comment.content = val.message
                  comment.created_time = val.created_time
                  comment.sentiment = sentimentAnalyzed
                  comment.save(err => {
                    if (!err) {
                      console.log(comment)
                    } else {
                      console.log("error when save comment", err)
                    }
                  })
              })
          });
      }
    }

  function callApiAnalysisSentiment(sentence, commentId, callback) {
    var http = require('http');
    var post_data = JSON.stringify({
        'sentence' : sentence,
        commentId
    });

    var post_options = {
        host: 'sentimentanalyzeserver.herokuapp.com',
        port: '80',
        // host: 'localhost',
        // port: '3333',
        // path: '/webhook',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            // console.log('Response: ' + chunk);
            callback(chunk)
        });
    });
    post_req.write(post_data);
    post_req.end();
  }
  function getProductId(commentId, callback) {
    https.get(
      `https://graph.facebook.com/v3.1/${commentId}/?fields=permalink_url&access_token=566972150348724|0bh_ZJFKYutb0rVNdxELBBl6Il4`, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        console.log(data)
        // let regex = new Regex(/(products)(\\\\u)(.*)(\\\\u)(.*)(fb_comment_id)/);
        // let productId = data.split('\\')[9].replace("u00252F", "")
        let productId = data.replace(/(%2F|%3F)/g, "--").split("--")[4]
        console.log(productId)
        callback(productId)
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
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
