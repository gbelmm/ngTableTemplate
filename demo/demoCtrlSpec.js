/**
 * @module test.demo
 * @name demoCtrl
 * @description
 * Tests for demoCtrl under demo
 * _Enter the test description._
 * */


describe('Controller: demo.demoCtrl', function () {

    // load the controller's module
    beforeEach(module('demo'));

    var ctrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('demoCtrl', {
            $scope: scope
        });
    }));

    it('should be defined', function () {
        expect(ctrl).toBeDefined();
    });
});
