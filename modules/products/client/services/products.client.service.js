// Products service used to communicate Products REST endpoints
(function () {
  'use strict';

  angular
    .module('products')
    .factory('ProductsService', ProductsService)
    .factory('CommentsService', CommentsService);

  ProductsService.$inject = ['$resource'];

  function ProductsService($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function CommentsService($resource) {
    return $resource('api/comments/:productId', {
      productId: '@_id'
    },
      {
        getComments : {
          method: 'get',
          isArray: true
        }
    });
  }
}());
