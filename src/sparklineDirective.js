/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:sparkline
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('sparkline', function () {
    return {
        restrict: 'AE',
        scope: { data: '=' },
        link: function (scope, elem) {
            scope.$watch('data', function (newval) {
                elem.sparkline(scope.data);
            });
        }
    };
});
