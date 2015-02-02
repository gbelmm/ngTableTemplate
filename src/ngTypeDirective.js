/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:ngType
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('ngType', function () {
    return {
        restrict: 'AE',
        scope: {
          data: '=',
          type: '='
        },
        template: '<ng-include src="getTemplateUrl()"  />',

            controller: ['$scope', '$element', function ($scope, $element) {

            $scope.getTemplateUrl = function () {

                return "type-"+$scope.type + ".html";

            };


        }],
        link: function (scope, elem, attr) {

        }
    };
});
