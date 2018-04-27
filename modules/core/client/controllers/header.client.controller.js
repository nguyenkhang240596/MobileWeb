'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', '$state', 'Authentication', 'Menus',
  function ($scope, $http, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    // $( "#cart-wrapper" ).mouseenter(
    //   function() {
    //     $scope.loadCart();
    //     conso
    //   }
    // );
    $scope.inCart = false;
    $('#cart-wrapper').hover(function() {
      var opacity = $(".b-cart:hover .cart-products").css("opacity");
      // console.log("hover", opacity)
      if ($scope.inCart == false) {
          $scope.inCart = true;
         
          $scope.loadCart();
      }
    }, 
    function() {
      var opacity = $(".b-cart:hover .cart-products").css("opacity");
      // console.log(opacity, $scope.inCart)
      if (opacity == undefined && $scope.inCart == true) {
          $scope.inCart = false;
           // console.log("not hover")
      }
    });
    $scope.loadCart = function() {
      $http.get('/api/users/getcart').success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.carts = response;
        var sumPrice = 0;
        for(var i of $scope.carts) {
          sumPrice += i.quantity * i.productId.price;
        }
        $scope.sumPrice = sumPrice;
        $scope.countCartItem = response.length;
        // $("#cart-wrapper .counter").html
        $("#cart-wrapper .counter").text(response.length)
        $("#sumPrice").text(sumPrice)
        // console.log("load cart " + response.length)
      }).error(function (response) {
        $scope.error = response.message;
      });
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
    $scope.loadCart()
  }
]);
