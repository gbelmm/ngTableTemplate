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
    .directive('pivot', ['localStorageService', function (localStorageService) {
        return {
            restrict: 'AE',
            scope: {
                data: '='
            },
            link: function (scope, elem, attr) {

                var renderers = $.extend($.pivotUtilities.renderers );


                var conf=localStorageService.get('pivot');
                if (conf==null){
                    conf={roww:[],cols:[]};

                }
                $(elem).pivotUI(scope.data, {
                    renderers: renderers,
                    rendererName: "Table",
                    cols:conf.cols,
                    rows:conf.rows,
                    onRefresh: function (config) {
                        var config_copy = JSON.parse(JSON.stringify(config));
                        //delete some values which are functions
                        delete config_copy["aggregators"];
                        delete config_copy["renderers"];
                        delete config_copy["derivedAttributes"];
                        //delete some bulky default values
                        delete config_copy["rendererOptions"];
                        delete config_copy["localeStrings"];
                        localStorageService.set('pivot',config_copy)
                        scope.$apply();

                    }
                })
            }
        };
    }]);
