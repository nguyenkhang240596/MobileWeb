(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state', '$stateParams', '$window', 'Authentication', 'ProductsService', 'initService'];

  function ProductsController ($scope, $state, $stateParams, $window, Authentication, ProductsService, initService) {
    var vm = this;

    vm.authentication = Authentication;
    // vm.product = product;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.findOne = function () {
      $scope.product = ProductsService.get({
        productId: $stateParams.productId
      });
      console.log($scope.product)
    };

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('products.view', {
          productId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    angular.element(document).ready(function() {
          // FB.XFBML.parse();
        FB.init({
            appId:  '566972150348724',
            status: true,
            // cookie: true,
            xfbml:  true,
            // oauth: true,
            version: 'v3.1'
        });
        // FB.XFBML.parse(); 
   });
    initService.init();

    // window.fbAsyncInit = function() {
    //   console.log("a")
    //     FB.init({
    //         appId:  '566972150348724',
    //         status: true,
    //         cookie: true,
    //         xfbml:  true,
    //         oauth: true
    //     });
    //     FB.XFBML.parse(); 
    //     console.log("load comment")
    //     // // AND THOSE WILL FIRE THE EVENTS :)

    //     // FB.Event.subscribe('comment.create',
    //     //     function (response) {
    //     //         console.log('create', response);
    //     //     });
    //     // FB.Event.subscribe('comment.remove',
    //     //     function (response) {
    //     //        console.log('remove', response);
    //     //     });

    // };
  } 

}());
