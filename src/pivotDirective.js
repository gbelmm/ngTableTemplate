/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:pivot
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable')
    .directive('pivot', function () {
    return {
        restrict: 'AE',
        scope:{
            data:'='
        },
        link: function (scope, elem, attr) {

            var renderers = $.extend($.pivotUtilities.renderers,
                $.pivotUtilities.gchart_renderers);
            $(elem).pivotUI(scope.data, {
                renderers: renderers,
                rendererName: "Table"
            })
        }
    };
});
