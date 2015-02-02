/**
 * @ngdoc directive
 * @name ngtemplatetable.directive:btn-order-filter
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('btnOrderFilter', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
          data:'='
        },
        templateUrl:'buttom-filter.html',
        link: function (scope, elem, attr) {


        }
    };
})
