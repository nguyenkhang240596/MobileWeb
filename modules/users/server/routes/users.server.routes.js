'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/getcart').get(users.getUserCart);
  app.route('/api/users/addtocart').post(users.addProductToUser);
  app.route('/api/users/updatecart').post(users.updateCart);
  app.route('/api/users/removeCartItem').post(users.removeCartItem);
  app.route('/api/users/addQuantity').post(users.addQuantity);
  app.route('/api/users/subQuantity').post(users.subQuantity);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/createOrder').post(users.createOrder);
  app.route('/api/users/getAllOrder').get(users.getAllOrder);
  app.route('/api/users/updateOrder').post(users.updateOrder);
  app.route('/api/users/getOrderDetails/:orderId').get(users.getOrderDetails);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
