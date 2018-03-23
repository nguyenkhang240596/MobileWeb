'use strict';

describe('Brands E2E Tests:', function () {
  describe('Test Brands page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/brands');
      expect(element.all(by.repeater('brand in brands')).count()).toEqual(0);
    });
  });
});
