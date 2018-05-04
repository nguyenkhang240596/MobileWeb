'use strict';

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
  let changes_events = req.body.entry[0].changes
    for (let i = 0; i < changes_events.length; i++) {
      let event = req.body.entry[0].changes[i]
      let val = event.value
      if (val.message) {
        console.log(val)
        console.log(val.from)
        console.log(val.message)
      }
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
