(function () {
  'use strict';

  angular
    .module('brands')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('brands', {
        abstract: true,
        url: '/brands',
        template: '<ui-view/>'
      })
      .state('brands.list', {
        url: '',
        templateUrl: 'modules/brands/client/views/list-brands.client.view.html',
        // controller: 'BrandsListController',
        // controllerAs: 'vm',
        data: {
          pageTitle: 'Brands List'
        }
      })
      .state('brands.create', {
        url: '/create',
        templateUrl: 'modules/brands/client/views/form-brand.client.view.html',
        controller: 'BrandsController',
        controllerAs: 'vm',
        resolve: {
          brandResolve: newBrand
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Brands Create'
        }
      })
      .state('brands.edit', {
        url: '/:brandId/edit',
        templateUrl: 'modules/brands/client/views/form-brand.client.view.html',
        controller: 'BrandsController',
        controllerAs: 'vm',
        resolve: {
          brandResolve: getBrand
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Brand {{ brandResolve.name }}'
        }
      })
      .state('brands.view', {
        url: '/:brandId',
        templateUrl: 'modules/brands/client/views/view-brand.client.view.html',
        controller: 'BrandsController',
        controllerAs: 'vm',
        resolve: {
          brandResolve: getBrand
        },
        data: {
          pageTitle: 'Brand {{ brandResolve.name }}'
        }
      });
  }

  getBrand.$inject = ['$stateParams', 'BrandsService'];

  function getBrand($stateParams, BrandsService) {
    return BrandsService.get({
      brandId: $stateParams.brandId
    }).$promise;
  }

  newBrand.$inject = ['BrandsService'];

  function newBrand(BrandsService) {
    return new BrandsService();
  }
}());
