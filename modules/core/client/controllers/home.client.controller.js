'use strict';


angular.module('core').controller('HomeController', ['$scope', '$state', '$http', 'Authentication', 'ProductsService', 'initService', 
  function ($scope, $state, $http, Authentication, ProductsService, initService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;

    var vm = this;

    // load products
    $scope.loadProducts = function () {
      vm.products = ProductsService.query();
    }

    initService.init();
    

    $scope.addProductToCart = function (product) {
      console.log(product._id, Authentication.user._id)
      if (!$scope.user) {
        window.scrollTo(0, 265);
        $state.go('authentication.signin');
        return;
      }
      $http.post('/api/users/addtocart', {
          productId : product._id
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        var headerScope = angular.element(document.getElementById('mHeader')).scope()
        console.log("addProductToCart")
        headerScope.loadCart()
        // alert("Đã thêm vào sản phẩm vào giỏ hàng")
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.loadCart = function() {
      $http.get('/api/users/getcart').success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.carts = response;
        var sumPrice = 0;
        var total = 0
        for(var i of $scope.carts) {
          sumPrice += i.quantity * i.productId.price;
          total += i.quantity
        }
        $scope.sumPrice = sumPrice;
        $scope.countCartItem = total;
        // $("#cart-wrapper .counter").html
        $('.total td:nth-child(2)').text("$" + (sumPrice + 50))
        console.log($scope.carts)
      }).error(function (response) {
        $scope.error = response.message;
      });
    }

    $scope.addQuantity = function(cartId) {
      $http.post('/api/users/addQuantity', { cartId }).success(function (response) {
            // If successful show success message and clear form
          $scope.success = true;
          $scope.loadCart()
        }).error(function (response) {
          $scope.error = response.message;
        });
    }

    $scope.subQuantity = function(cartQuantity, cartId) {
      if (cartQuantity > 0) {
        $http.post('/api/users/subQuantity', { cartId }).success(function (response) {
            // If successful show success message and clear form
          $scope.success = true;
          $scope.loadCart()
        }).error(function (response) {
          $scope.error = response.message;
        });
      }
    }

    $scope.removeCart = function(e, cartId) {
      let carts = $scope.carts;
      for(let i in $scope.carts) {
        if (carts[i]._id == cartId) {
          $scope.carts.splice(i, 1)
          $http.post('/api/users/updatecart', { cart : carts }).success(function (response) {
            // If successful show success message and clear form
            $scope.success = true;
            $scope.loadCart()
            $(e.target.parentElement.parentElement.parentElement).remove()
          }).error(function (response) {
            $scope.error = response.message;
          });
          break;
        }
      }
    }

    $scope.checkoutCart = function(carts) {
      var cartsId = []
      for(var cart of carts) {
        cartsId.push(cart._id)
      }
      $http.post('/api/users/createOrder', { carts : cartsId }).success(function (response) {
          // If successful show success message and clear form
          $scope.success = true;
          $scope.carts = []
        }).error(function (response) {
          $scope.error = response.message;
        });
    }
  }
]);