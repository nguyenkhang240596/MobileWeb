'use strict';

angular
	.module('brands')
	.controller('BrandsListController', ['$scope', '$stateParams', '$location', 'Authentication', 'BrandsService', 'ProductsService',
	function BrandsListController($scope, $stateParams, $location, Authentication, BrandsService, ProductsService) {
		var vm = this;

	    // load products
	    $scope.loadProducts = function () {
	      vm.products = ProductsService.query();
	      console.log(vm.products);
	    }

		// Find a list of Brands
		$scope.find = function () {
			$scope.brands = BrandsService.query();
		};
	}
]);

