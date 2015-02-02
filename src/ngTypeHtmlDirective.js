/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:ngTypeHtml
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('ngTypeHtml', ['$parse','$compile', function ($parse,$compile) {
    return {
        restrict: 'AE',
        link: function(scope, element, attr){
            scope.$watch(attr.content, function() {
                element.html($parse(attr.content)(scope));
                $compile(element.contents())(scope);
            }, true);
        }
    };
}]);
