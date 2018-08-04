(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state', '$http', '$stateParams', '$window', 'Authentication', 'ProductsService', 'CommentsService', 'initService'];

  function ProductsController ($scope, $state, $http, $stateParams, $window, Authentication, ProductsService, CommentsService, initService) {
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

    initLoadData()
    eventProcessing()

    function initLoadData() {
      vm.comments = CommentsService.getComments({
        productId: $stateParams.productId
      });
      vm.comments.$promise.then(arr => { vm.commentLength = arr.length})
    }

    vm.formatDate = function(date) {
      function addZero(i) {
          if (i < 10) {
              i = "0" + i;
          }
          return i;
      }
      var d = new Date(date)
      var day = addZero(d.getDate());
      var M = addZero(d.getMonth() + 1);
      var y = addZero(d.getFullYear());
      var h = addZero(d.getHours());
      var m = addZero(d.getMinutes());
      var s = addZero(d.getSeconds());
      return day+"-"+M+"-"+y+" "+h+":"+m+":"+s;
    }

    function eventProcessing() {
      $("#top-review").off('click').on('click', (event) => {
        let display = $("#popup-top-review").css('display')
        if (display != "block") {
          $("#popup-top-review").css({'display' : 'block'})
        } else if (display != "none") {
          $("#popup-top-review").css({'display' : 'none'})

        }
      })

      $(document).mouseup(function(e) 
      {
          var container = $("#top-review-content");

          // if the target of the click isn't the container nor a descendant of the container
          if (!container.is(e.target) && container.has(e.target).length === 0) 
          {
            $("#popup-top-review").css({'display' : 'none'})
              // container.hide();
          }
      });

      $(".close-button-review ").click(() => {
        $("#popup-top-review").css({'display' : 'none'})
      })
    }

    $scope.addProductToCart = function (product) {
      console.log(product._id, Authentication.user._id)
      if (!Authentication.user._id) {
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
        headerScope.loadCart()
        // alert("Đã thêm vào sản phẩm vào giỏ hàng")
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

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

        // In your onload method
        FB.Event.subscribe('comment.create', comment_callback);
        FB.Event.subscribe('comment.remove', comment_callback);

        // In your JavaScript
        var comment_callback = function(response) {
          alert(response)
          console.log("comment_callback");
          console.log(response);
        }
        // FB.Event.subscribe('comment.create',
        //     function (response) {
        //       console.log("hi")
        //         console.log('create', response);
        // });
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

        // FB.Event.subscribe('comment.create',
        //     function (response) {
        //         console.log('create', response);
        //     });
    //     // FB.Event.subscribe('comment.remove',
    //     //     function (response) {
    //     //        console.log('remove', response);
    //     //     });

    // };
  } 

}());
