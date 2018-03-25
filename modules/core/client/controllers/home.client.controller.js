'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ProductsService',
  function ($scope, Authentication, ProductsService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var vm = this;

    // load products
    $scope.loadProducts = function () {
      vm.products = ProductsService.query();
      console.log(vm.products);
    }


  }
]);
