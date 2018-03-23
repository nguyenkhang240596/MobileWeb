(function () {
  'use strict';

  describe('Brands Route Tests', function () {
    // Initialize global variables
    var $scope,
      BrandsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BrandsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BrandsService = _BrandsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('brands');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/brands');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BrandsController,
          mockBrand;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('brands.view');
          $templateCache.put('modules/brands/client/views/view-brand.client.view.html', '');

          // create mock Brand
          mockBrand = new BrandsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Brand Name'
          });

          // Initialize Controller
          BrandsController = $controller('BrandsController as vm', {
            $scope: $scope,
            brandResolve: mockBrand
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:brandId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.brandResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            brandId: 1
          })).toEqual('/brands/1');
        }));

        it('should attach an Brand to the controller scope', function () {
          expect($scope.vm.brand._id).toBe(mockBrand._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/brands/client/views/view-brand.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BrandsController,
          mockBrand;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('brands.create');
          $templateCache.put('modules/brands/client/views/form-brand.client.view.html', '');

          // create mock Brand
          mockBrand = new BrandsService();

          // Initialize Controller
          BrandsController = $controller('BrandsController as vm', {
            $scope: $scope,
            brandResolve: mockBrand
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.brandResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/brands/create');
        }));

        it('should attach an Brand to the controller scope', function () {
          expect($scope.vm.brand._id).toBe(mockBrand._id);
          expect($scope.vm.brand._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/brands/client/views/form-brand.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BrandsController,
          mockBrand;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('brands.edit');
          $templateCache.put('modules/brands/client/views/form-brand.client.view.html', '');

          // create mock Brand
          mockBrand = new BrandsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Brand Name'
          });

          // Initialize Controller
          BrandsController = $controller('BrandsController as vm', {
            $scope: $scope,
            brandResolve: mockBrand
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:brandId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.brandResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            brandId: 1
          })).toEqual('/brands/1/edit');
        }));

        it('should attach an Brand to the controller scope', function () {
          expect($scope.vm.brand._id).toBe(mockBrand._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/brands/client/views/form-brand.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
