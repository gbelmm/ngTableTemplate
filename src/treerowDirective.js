/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:treerow
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('treeRow', function () {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,

        scope: {
            data:'='
        },
        templateUrl:'tree-row.html',
        link: function (scope, elem, attr) {

        }
    };
});
