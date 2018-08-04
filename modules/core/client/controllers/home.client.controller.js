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

    $scope.shipping = 5000
    initService.init();
    $scope.eventProcessing = function() {
      $(document).mouseup(function(e) 
      {
          var container = $("#order-detail-content");
          if (!container.is(e.target) && container.has(e.target).length === 0) 
          {
              $("#popup-detail").css({'display' : 'none'})
          }
      });

      $(".close-button-review ").click(() => {
        $("#popup-detail").css({'display' : 'none'})
      })
    }

    $scope.displayOrderDetails = function() {
      $("#popup-detail").css({ display : 'block'})        
    }

    $scope.loadOrderDetails = function(orderId) {
      console.log(orderId)
      $http.get('/api/users/getOrderDetails/' + orderId).success(function (response) {
        // If successful show success message and clear form
        console.log(response)
        $scope.success = true;
        $scope.carts = response;
        var sumPrice = 0;
        var total = 0
        for(var i of $scope.carts) {
          sumPrice += i.quantity * i.productId.price;
          total += i.quantity
        }
        $scope.sumPrice = sumPrice;

        //fee charge
        // $scope.sumPrice += 70;
        $scope.countCartItem = total;

        // $("#cart-wrapper .counter").html
        $('.total td:nth-child(2)').text((sumPrice+$scope.shipping) + " VND")
        $("#cart-wrapper .counter").text(total)
        $("#sumPrice").text(sumPrice)
        $scope.displayOrderDetails()
      }).error(function (response) {

        $scope.error = response.message;
      });
    }

    $scope.eventProcessing()
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


    $scope.changeStatus = function(event, orderId) {
      let selectDom = $(event.path[0])
      if (selectDom.val() == "Pending") {
        selectDom.css({color:'red'})
        $scope.updateOrderStatus(orderId, "1")
      } else {
        selectDom.css({color:'green'})
        $scope.updateOrderStatus(orderId, "2")
      }
    }

    $scope.updateOrderStatus = function(orderId, status) {
      console.log(orderId, status)
      $http.post('/api/users/updateOrder', {
          orderId : orderId,
          status : status
      }).success(function (response) {
      }).error(function (response) {
        $scope.error = response.message;
      });
    }

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
        // var headerScope = angular.element(document.getElementById('mHeader')).scope()
        // console.log("addProductToCart")
        // headerScope.loadCart()
        $scope.loadCart();
        // alert("Đã thêm vào sản phẩm vào giỏ hàng")
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.loadCart = function() {
      $http.get('/api/users/getcart').success(function (response) {
        // If successful show success message and clear form
        console.log(response)
        $scope.success = true;
        $scope.carts = response;
        var sumPrice = 0;
        var total = 0
        for(var i of $scope.carts) {
          sumPrice += i.quantity * i.productId.price;
          total += i.quantity
        }
        $scope.sumPrice = sumPrice;

        //fee charge
        // $scope.sumPrice += 70;
        $scope.countCartItem = total;

        // $("#cart-wrapper .counter").html
        $('.total td:nth-child(2)').text((sumPrice+$scope.shipping) + " VND")
        $("#cart-wrapper .counter").text(total)
        $("#sumPrice").text(sumPrice)
        console.log($scope.carts)
      }).error(function (response) {

        $scope.error = response.message;
      });
    }
    if ($scope.user) {
      $scope.loadCart();
    }

    $scope.loadOrder = function() {
      $http.get('/api/users/getAllOrder').success(function (response) {
        // If successful show success message and clear form
        console.log(response)
        $scope.success = true;
        $scope.orders = response;
        console.log($scope.orders)
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
          $http.post('/api/users/removeCartItem', { cartId : cartId }).success(function (response) {
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
      var province = $("#province option:selected").text()
      var fullAddress = $("#fullAddress").val()
      var userName = $("#userName").val()
      var phoneNumber = $("#phoneNumber").val()
      console.log( province, fullAddress)
      if ($scope.carts.length == 0) {
          alert("Không có sản phẩm nào để đặt hàng")
      } else {
        if (province.includes("province") || !fullAddress) {
          // $("#fullAddress").css({border: '1px solid #ff3434'})
          alert("Vui lòng điền đầy đủ thông tin trước khi đặt hàng")
        } else {
          createOrder(fullAddress + ", " + province, userName, phoneNumber)
        }
      }
      function createOrder(_fullAddress, userName, phoneNumber) {
        
        $http.post('/api/users/createOrder',
          { userId : Authentication.user._id, 
            fullAddress:_fullAddress,
            userName : userName,
            shippingPrice : $scope.shipping,
            totalPrice : $scope.sumPrice,
            phoneNumber : phoneNumber })
        .success(function (response) {
            // If successful show success message and clear form
            $scope.success = true;
            // $scope.carts = []
            alert("Đã đặt hàng thành công, trang web sẽ tải lại trong 2s")
            setTimeout(function() {
              window.location.reload()
            }, 2000)

          }).error(function (response) {
            $scope.error = response.message;
          });
        }
    }
  }
]);