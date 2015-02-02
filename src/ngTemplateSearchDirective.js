/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:ngTemplateSearch
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('ngTemplateSearch', function () {
    return {
        restrict: 'A',
        templateUrl: 'search.html',
        link: function (scope, elem, attr) {

        }
    };
});
