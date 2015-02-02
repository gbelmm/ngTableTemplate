/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:ngTemplateNumberPerPage
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('ngTemplateNumberPerPage', function () {
    return {
        restrict: 'A',
        templateUrl: 'numberPerPage.html',
        link: function (scope, elem, attr) {

        }
    };
});
