/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:ngTemplateTable
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('ngTemplateTable', ['ui.bootstrap', 'ngSanitize', 'nsPopover', 'angular.filter','ui.select2','LocalStorageModule'])
    .run(['paginationConfig', function (paginationConfig) {
        paginationConfig.firstText = '<<';
        paginationConfig.previousText = '<';
        paginationConfig.nextText = '>';
        paginationConfig.lastText = '>>';


    }])
    .directive('ngTemplateTable', ['$templateCache', '$compile', '$filter', '$sce', '$http', '$parse', '$timeout', function ($templateCache, $compile, $filter, $sce, $http, $parse, $timeout) {
        return {
            restrict: 'AE',
            transclude: true,

            scope: {
                type: "=",
                model: "=",
                paginate: '=',
                numperpage: '=',
                order: '=',
                search: '=',
                column: '=',
                actions: '=',
                expandOn: '='
            },
            template: '<ng-include src="getTemplateUrl()"  />',

            controller: ['$scope', '$element', '$rootScope', function ($scope, $element) {

                $scope.getTemplateUrl = function () {
                    if ($scope.type == '' || $scope.type == undefined)
                        $scope.type = 'table';
                    return $scope.type + ".html";

                };


            }],
            link: function (scope, element, attrs) {
                scope.resp = angular.copy(scope.model);
                scope.data = angular.copy(scope.model);

                scope.$watch('model', function (value) {

                    scope.resp = scope.model;
                    scope.data = scope.model;
                    var data = angular.copy(scope.data);

                    scope.tree = getTree(data, 'id', 'parentId');


                });



                scope.iconLeaf = attrs.iconLeaf || "glyphicon glyphicon-file";
                scope.iconExpand = attrs.iconExpand || "glyphicon glyphicon-menu-down";
                scope.iconCollapse = attrs.iconCollapse || "glyphicon glyphicon-menu-right";
                scope.ghnumperpage = 0;
                scope.ghnumperpage = scope.numperpage;

                var template = '';
                var order = '';
                scope.ghfilter = '';
                scope.ghrev = true;
                scope.ordered_columns = [];
                var totalColumns = 0;
                scope.renderTable = function () {

                    scope.ordered_columns = [];
                    var order = 0;
                    for (var i in scope.resp[0]) {
                        if (i !== '$$hashKey' && i !== 'parentId' && i !== 'children' && i !== 'id' && i !== 'icon' && i !== 'edit'  && i !== 'delete') {

                            var item = [];
                            var unique = $filter('unique')(scope.resp, i);
                            for (var iu = 0; iu < unique.length; iu++) {
                                var fil = $filter('filter')(scope.omit, {id: i, data: unique[iu][i]}, true);

                                var state = true;
                                if (fil[0] !== undefined)
                                    state = false;
                                item.push({value: unique[iu][i], state: state})
                            }

                            if (scope.column === undefined) {
                                scope.ordered_columns.push({
                                    id: i,
                                    name: i,
                                    field: i,
                                    displayName: i,
                                    inFilter: true,
                                    inTable: true,
                                    inTree: true,
                                    items: item,
                                    filter: true,
                                    sort: true,
                                    order: true,
                                    all: true,
                                    type: 'text',
                                    customHTML: '',
                                    orderColumn: 0
                                });
                            }
                            else {
                                var column = $filter('filter')(scope.column, {data: i}, true);

                                if (column[0] !== undefined) {

                                    if (column[0].filter == undefined)
                                        column[0].filter = true;
                                    if (column[0].sort == undefined)
                                        column[0].sort = true;
                                    if (column[0].customHTML == undefined)
                                        column[0].customHTML = '';
                                    if (column[0].name == undefined)
                                        column[0].name = i;
                                    if (column[0].type == undefined)
                                        column[0].type = 'text';
                                    if (column[0].inTable== undefined)
                                        column[0].inTable = true;
                                    if (column[0].i=='edit' || column[0].i=='delete')
                                        column[0].type=column[0].i;
                                    column[0].order = scope.column.indexOf(column[0]) + 1;

                                    scope.ordered_columns.push({
                                        id: i,
                                        name: column[0].name,
                                        field: i,
                                        displayName: column[0].name,
                                        inFilter: column[0].inFilter,
                                        inTable: column[0].inTable,
                                        inTree: column[0].inTree,
                                        colType: 'ngtemplate-' + column[0].colType,
                                        class: column[0].class,
                                        filter: column[0].filter,
                                        sort: column[0].sort,
                                        items: item,
                                        all: true,
                                        type: column[0].type,
                                        customHTML: column[0].customHTML,
                                        orderColumn: column[0].order
                                    });

                                }
                            }
                            /*
                             else


                             */

                        }
                    }
                    totalColumns = scope.ordered_columns.length;


                };
                scope.omit = [];

                scope.selectAll = function (id, state) {

                    var fil = $filter('filter')(scope.ordered_columns, {id: id});

                    var index = scope.ordered_columns.indexOf(fil[0]);

                    for (var i = 0; i < scope.ordered_columns[index].items.length; i++) {
                        scope.ordered_columns[index].items[i].state = state;
                        var filtro;
                        if (state)
                            filtro = id + '!=="' + scope.ordered_columns[index].items[i].value + '"';
                        else
                            filtro = id + '=="' + scope.ordered_columns[index].items[i].value + '"';
                        if (!state)
                            scope.omit.push({value: filtro, id: id, data: scope.ordered_columns[index].items[i].value});
                        else {
                            var fil = $filter('filter')(scope.omit, {
                                id: id
                            });
                            for (var ii = 0; ii < fil.length; ii++) {
                                var index2 = scope.omit.indexOf(fil[ii]);
                                scope.omit.splice(index2, 1);
                            }


                        }
                    }

                    scope.ghfilters();
                }
                scope.ngFilterCheck = function (id, valor, estado) {

                    var filtro;
                    if (estado)
                        filtro = id + '!=="' + valor + '"';
                    else
                        filtro = id + '=="' + valor + '"';
                    if (!estado)
                        scope.omit.push({value: filtro, id: id, data: valor});
                    else {
                        var fil = $filter('filter')(scope.omit, {id: id, data: valor});
                        var index = scope.omit.indexOf(fil[0]);
                        scope.omit.splice(index, 1);
                    }

                    scope.ghfilters();


                };
                scope.ghsearch = '';
                scope.ghfiltername = '';


                scope.ghOrder = function (name) {

                    scope.ghrev = !scope.ghrev;
                    scope.ghfiltername = name;

                    scope.ghfilters();
                };


                if (scope.search == true) {

                    var pag = '<div class="row" >' +
                        '<div class="col-md-2" ng-template-number-per-page >' +


                        '</div><div class="col-md-4"></div>';


                    pag = pag + '<div class="col-md-6" ng-template-search ng-show=" type!=\'pivot\'">' +

                    '</div>';

                    pag = pag + '<hr><div class="col-md-12">';
                    if (scope.order == true) {
                        pag = pag + '<div class="btn-group" ng-show="type!=\'table\' && type!=\'tree\'  && type!=\'pivot\'" role="group" aria-label="...">';

                        var btn = '<div btn-order-filter data="ordered_columns"></div>';
                        pag = pag + btn;

                        pag = pag + '</div>';

                    }

                    pag = pag + '</div>' +
                    '<hr/>' +
                    '</div>';
                    element.prepend($compile(pag)(scope));

                }


                if (scope.paginate == true) {
                    scope.ghtotalItems = scope.resp.length;
                    scope.ghcurrentPage = 1;

                    var pag = '<div class="text-right" ng-show="type!=\'tree\' && type!=\'pivot\'"><pagination boundary-links="true" items-per-page="ghnumperpage" ng-change="ghfilters()" total-items="ghtotalItems" ng-model="ghcurrentPage" ></pagination></div>';

                    element.append($compile(pag)(scope));

                }
                scope.internal = false;
                scope.ghfilters = function () {
                    scope.internal = true;

                    if (scope.resp.length == 0)
                        scope.resp = scope.data;

                    if (scope.search == true)
                        scope.data = $filter('filtro2')(scope.resp, scope.ghsearch);


                    if (scope.omit.length > 0) {
                        for (var i = 0; i < scope.omit.length; i++)
                            scope.data = $filter('omit')(scope.data, scope.omit[i].value);
                    }





                    if (scope.paginate == true && scope.type != 'tree') {
                        var begin = ((scope.ghcurrentPage - 1) * scope.ghnumperpage);
                        var end = begin + scope.ghnumperpage;
                        scope.data = scope.data.slice(begin, end);
                    }


                    scope.ghtotalItems = scope.resp.length;
                    if (scope.type == 'tree') {


                        var data = angular.copy(scope.data);

                        if (scope.ghsearch.length<2)
                            scope.tree = getTree(data, 'id', 'parentId');
                        else
                            scope.tree = data;
                    }

                    if (scope.order == true) {

                        scope.data = $filter('orderBy')(scope.data, scope.ghfiltername, scope.ghrev);


                    }


                    $timeout(function () {
                        scope.internal = false;
                    });

                };
                scope.$watch('data', function (data) {

                    if (scope.internal === false) {

                        scope.ghfilters();
                        scope.renderTable();

                    }


                }, true);
                var data = angular.copy(scope.data);
                scope.tree = getTree(data, 'id', 'parentId');
                scope.$watch('type', function () {
                    if (scope.type == 'table' || scope.type == 'tree') {
                        scope.renderTable();

                        if (scope.type == 'tree') {
                            scope.runtree()
                        }
                    }
                })


                scope.runtree = function () {

                    //scope.tree=getTree(scope.resp,'id','parentId');

                }
                function getNestedChildren(arr, parent,ini) {
                    var out = []
                    for(var i in arr) {
                            if (ini)
                        if(arr[i].parentId == parent  ) {
                            var children = getNestedChildren(arr, arr[i].id,false)

                            if(children.length) {
                                arr[i].children = children
                            }
                            out.push(arr[i])
                        }
                    }
                    return out
                }

                function getTree(data, primaryIdName, parentIdName) {

                    if (!data || data.length == 0 || !primaryIdName || !parentIdName)
                        return [];

                    var tree = [],
                        rootIds = [],
                        item = data[0],
                        primaryKey = item[primaryIdName],
                        treeObjs = {},
                        parentId,
                        parent,
                        len = data.length,
                        i = 0;

                   for (var i=0;i<len;i++){
                        item = data[i];
                        item.level = 0;

                        primaryKey = item[primaryIdName];
                        treeObjs[primaryKey] = item;

                        parentId = item[parentIdName];

                        if (parentId !== undefined && treeObjs[parentId] !== undefined) {

                            parent = treeObjs[parentId];


                            if (parent.children) {
                                parent.children.push(item);

                            }
                            else {
                                parent.children = [item];

                            }
                        }
                        else {
                            rootIds.push(primaryKey);
                        }

                    }

                    for (var i = 0; i < rootIds.length; i++) {

                        tree.push(treeObjs[rootIds[i]]);
                    }



                    return tree;

                }

                scope.toggleChildren = function (data) {
                    data.childrenVisible = !data.childrenVisible;
                    data.folderClass = data.childrenVisible ? "fa-folder-open" : "fa-folder";
                };
                scope.treefn = function (c, d) {

                }
                scope.ghnumberPerPage = [3, 5, 10, 20, 30, 40];

                var sumAll = 0;


                scope.getStretchedColumnWidth = function (d) {
                    var sumAll = 0;
                    var width = window.outerWidth;
                    ;
                    for (var i = 0; i < totalColumns; i++) {

                        sumAll += width;
                    }
                    var stretchAllRatio = width / sumAll;


                    width = width * stretchAllRatio;

                    return width;
                };

                scope.$watch('ghsearch', function () {
                    scope.ghfilters();
                }, true);


                scope.$watch('column', function (value) {
                    scope.renderTable();
                    scope.ghfilters();
                }, true);


            }
        }
    }])
;/**
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
;/**
 * Created by gbelmm on 13-01-15.
 */
angular.module('ngTemplateTable')
     .filter('capitalize', function () {
    return function (input, format) {
        if (!input) {
            return input;
        }
        format = format || 'all';
        if (format === 'first') {

            return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        } else {
            var words = input.split(' ');
            var result = [];
            words.forEach(function (word) {
                if (word.length === 2 && format === 'team') {

                    result.push(word.toUpperCase());
                } else {
                    result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
                }
            });
            return result.join(' ');
        }
    };
    ;
}).filter('filtro2', ['$filter',function($filter) {
        return function(data,str) {
            if (str==undefined) str='';
            if (!Array.isArray(str)) {

                var str = str.replace(/^\s+/, '');

                for (var i = str.length - 1; i >= 0; i--) {
                    if (/\S/.test(str.charAt(i))) {
                        str = str.substring(0, i + 1)
                        break
                    }
                }

                var buscar= str
                    .split(/\s+/)
                    .map(function (token) {
                        return token.replace(/^\W+/, '').replace(/\W+$/, '').toLowerCase()
                    });
            }

            var data2=Array()
            var ii=0;
            buscar.forEach(function(le,i,leee){

                if (ii==0){

                    data2= $filter('filter')(data, le);
                }else{

                    data2= $filter('filter')(data2, le);
                }
                ii++;
            });

            return data2;
        };
    }]);angular.module('ui.bootstrap.pagination', [])

.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page) {
    if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function( key ) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };
  $scope.noPrevious = function() {
    return $scope.page === 1;
  };
  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };

  $scope.$watch('totalItems', function() {
    $scope.totalPages = self.calculateTotalPages();
  });
      $scope.$parent.$watch('ghnumperpage', function(value) {


        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
  $scope.$watch('totalPages', function(value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ( $scope.page > value ) {
      $scope.selectPage(value);
    } else {
      ngModelCtrl.$render();
    }
  });
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@'
    },
    require: ['pagination', '?ngModel'],
    controller: 'PaginationController',
    template: '<ul class="pagination">'+
      '<li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>'+
    '<li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>'+
'<li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>'+
'<li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>'+
'<li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>'+
'</ul>',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('pager', ['pagerConfig', function(pagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@'
    },
    require: ['pager', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: '<ul class="pager">'+
      '<li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>'+
   '<li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>'+
'</ul>',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
      paginationCtrl.init(ngModelCtrl, pagerConfig);
    }
  };
}]);
;angular.module('ngTemplateTable').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('buttom-filter.html',
    "<div class=\"btn-group\" ng-repeat=\"btndata in data\" ng-show=\"btndata.sort\"><button type=\"button\" ng-click=\"ghOrder(btndata.id)\" class=\"btn btn-default\"><span style=\"float: left;margin-right: 5px;opacity: 0.2\" class=\"fa\" ng-class=\"{'fa-sort':ghfiltername!=btndata.id,'fa-sort-desc':ghfiltername==btndata.id && ghrev,'fa-sort-asc':ghfiltername==btndata.id && !ghrev}\">&nbsp;</span> {{btndata.name|capitalize}}</button> <button ns-popover ns-popover-template=\"popover-data.html\" ns-popover-trigger=\"click\" ns-popover-theme=\"ns-popover-list-theme\" class=\"btn btn-default\"><span class=\"caret\"></span></button></div>"
  );


  $templateCache.put('numberPerPage.html',
    "<select class=\"form-control\" ui-select2 ng-show=\"  type!='tree'  && type!='pivot'\" ng-model=\"ghnumperpage\" ng-change=\"ghfilters()\"><option ng-repeat=\"d in ghnumberPerPage\">{{d}}</option></select>"
  );


  $templateCache.put('pivot.html',
    "<div pivot=\"\" data=\"data\"></div>"
  );


  $templateCache.put('popover-data-table.html',
    "<ul class=\"list-group\"><li class=\"list-group-item\" ng-switch on=\"c.type\"><input type=\"text\" ng-model=\"c.search\" ng-switch-default></li><li class=\"list-group-item2\"><input type=\"checkbox\" ng-change=\"selectAll(c.id,c.all)\" ng-model=\"c.all\">(Seleccionar Todos)</li><li class=\"list-group-item2\" ng-repeat=\"d in c.items|filter:c.search\"><input type=\"checkbox\" ng-model=\"d.state\" ng-change=\"ngFilterCheck(c.id,d.value,d.state)\"> {{d.value}}</li></ul>"
  );


  $templateCache.put('popover-data-tree.html',
    "<ul class=\"list-group\"><li class=\"list-group-item2\"><input type=\"text\" ng-model=\"col.search\"></li><li class=\"list-group-item2\"><input type=\"checkbox\" ng-change=\"selectAll(col.id,col.all)\" ng-model=\"col.all\">(Seleccionar Todos)</li><li class=\"list-group-item2\" ng-repeat=\"d in col.items|filter:col.search\"><input type=\"checkbox\" ng-model=\"d.state\" ng-change=\"ngFilterCheck(col.id,d.value,d.state)\"> {{d.value}}</li></ul>"
  );


  $templateCache.put('popover-data.html',
    "<ul class=\"list-group\"><li class=\"list-group-item\" ng-switch on=\"btndata.type\"><input type=\"text\" ng-model=\"btndata.search\" ng-switch-default></li><li class=\"list-group-item2\"><input type=\"checkbox\" ng-change=\"selectAll(btndata.id,btndata.all)\" ng-model=\"btndata.all\">(Seleccionar Todos)</li><li class=\"list-group-item2\" ng-repeat=\"d in btndata.items|filter:btndata.search\"><input type=\"checkbox\" ng-model=\"d.state\" ng-change=\"ngFilterCheck(btndata.id,d.value,d.state)\"> {{d.value}}</li></ul>"
  );


  $templateCache.put('popover-window.html',
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen, fade: animation }\"><div class=\"arrow\"></div><div class=\"popover-inner\"><h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3><div class=\"popover-content\" tooltip-template-transclude></div></div></div>"
  );


  $templateCache.put('search.html',
    "<form class=\"form-horizontal\"><div class=\"form-group has-feedback\"><label class=\"control-label col-sm-3\" for=\"inputSuccess3\">Buscar</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" id=\"inputSuccess3\" ng-model=\"ghsearch\"> <span class=\"glyphicon glyphicon-search form-control-feedback\" aria-hidden=\"true\"></span> <span id=\"inputSuccess3Status\" class=\"sr-only\">(success)</span></div></div></form>"
  );


  $templateCache.put('table.html',
    "<table class=\"table table-bordered table-condensed table-striped table-hover\"><thead><tr><th style=\"cursor: pointer\" ng-show=\"c.inTable\" ng-repeat=\"c in ordered_columns|orderBy:'orderColumn'\" class=\"{{c.class}}\"><i style=\"float: left;margin-right: 5px;opacity: 0.2\" class=\"fa\" ng-class=\"{'fa-sort':ghfiltername!=c.id && c.order==true,'fa-sort-desc':ghfiltername==c.id && ghrev  && c.order==true,'fa-sort-asc':ghfiltername==c.id && !ghrev  && c.order==true}\"></i><div style=\"position:relative\" ng-show=\"c.filter==true\"><div ns-popover class=\"ui-grid-column-menu-button\" ns-popover-template=\"popover-data-table.html\" ns-popover-trigger=\"click\" ns-popover-hide-on-click=\"false\" ns-popover-theme=\"ns-popover-tooltip-theme\"><span class=\"caret\"></span></div></div><p ng-click=\"ghOrder(c.id)\" style=\"margin-left: 8px\">{{ c.name|capitalize }}</p></th></tr><tbody><tr ng-repeat=\"value in data\" class=\"animate-repeat\"><td ng-repeat=\"c in ordered_columns|orderBy:'orderColumn'\" ng-show=\"c.inTable\" ng-switch on=\"c.type\"><p ng-switch-when=\"text\" class=\"{{c.colType}}\">{{ value[c.id] }} <i ng-show=\"c.colType=='ngtemplate-percentage'\">%</i></p><p ng-switch-when=\"date\" class=\"{{c.colType}}\">{{ value[c.id]|date:'dd-MM-yyyy HH:mm:ss' }}</p><p ng-switch-when=\"html\" class=\"{{c.colType}}\" ng-type-html=\"\" content=\"value[c.id]\"></p><p ng-switch-when=\"customhtml\" class=\"{{c.colType}}\" ng-type-html=\"\" content=\"c.customHTML\"></p><p ng-switch-when=\"sparkline\" class=\"{{c.colType}}\" sparkline=\"\" data=\"value[c.id]\"></p><p ng-switch-default class=\"{{c.colType}}\" ng-type type=\"c.type\" data=\"value[c.id]\"></p></td></tr></tbody></thead></table>"
  );


  $templateCache.put('tree.html',
    "<tree-grid expand-on=\"expandOn\" tree-data=\"tree\" col-defs=\"ordered_columns\" expand-level=\"2\" iconleaf=\"iconLeaf\" iconexpand=\"iconExpand\" iconcollapse=\"iconCollapse\"></tree-grid>"
  );


  $templateCache.put('treeComponent.html',
    "<div><table class=\"table table-bordered table-striped tree-grid\"><thead class=\"\"><tr><th class=\"{{colDefinitions[0].class}}\">{{expandingPropertyName}}</th><th ng-repeat=\"col in colDefinitions\" ng-if=\"col.field!==expandingProperty\" ng-show=\"col.inTree\" class=\"{{c.class}}\">{{(col.displayName || col.field)|capitalize}}</th></tr></thead><tbody><tr ng-init=\"value=row.branch;\" ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-class=\"'level-'+{{ row.level+(row.branch.selected ? ' active':'')}}\" class=\"tree-grid-row\"><td class=\"\"><a style=\"color:#000000\" ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"></i> <i ng-class=\"row.tree_icon_value\" class=\"indented tree-icon\"></i></a><span class=\"indented tree-label\" ng-click=\"user_clicks_branch(row.branch)\">{{row.branch[expandingProperty]}}</span></td><td ng-if=\"col.field!==expandingProperty\" ng-show=\"col.inTree\" ng-repeat=\"col in colDefinitions\" ng-switch on=\"col.type\"><p ng-switch-when=\"text\" class=\"{{col.colType}}\">{{ row.branch[col.id] }} <i ng-show=\"col.colType=='ngtemplate-percentage'\">%</i></p><p ng-switch-when=\"date\" class=\"{{col.colType}}\">{{ row.branch[col.id] }}</p><p ng-switch-when=\"html\" class=\"{{col.colType}}\" ng-type-html=\"\" content=\"row.branch[col.id]\"></p><p ng-switch-when=\"customhtml\" class=\"{{col.colType}}\" ng-type-html=\"\" content=\"col.customHTML\"></p><p ng-switch-when=\"sparkline\" class=\"{{col.colType}}\" sparkline=\"\" data=\"row.branch[col.id]\"></p><p ng-switch-default class=\"{{col.colType}}\" ng-type type=\"col.type\" data=\"row.branch[col.id]\"></p></td></tr></tbody></table></div>"
  );


  $templateCache.put('type-progress.html',
    "<div class=\"progress\"><div class=\"progress-bar progress-bar-striped\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{data}}%\"><span class=\"sr-only\">{{data}} Complete</span></div></div>"
  );

}]);
;/**
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
;/**
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
;/**
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
;/**
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
;
(function() {
  var module;

  module = angular.module('ngTemplateTable');

  module.directive('treeGrid', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        //templateUrl:'tree-grid-template.html',
        //template:"<div><table class=\"table table-bordered table-striped tree-grid\"><thead class=\"text-primary\"><tr><th>{{expandingProperty}}</th><th ng-repeat=\"col in colDefinitions\">{{col.displayName || col.field}}</th></tr></thead><tbody><tr ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\"><td class=\"text-primary\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"></i></a><span class=\"indented tree-label\">{{row.branch[expandingProperty]}}</span></td><td ng-repeat=\"col in colDefinitions\">{{row.branch[col.field]}}</td></tr></tbody><table></div>",
        templateUrl: 'treeComponent.html'
          ,
        replace: true,
        scope: {
          treeData: '=',
          colDefs:'=',
          expandOn:'=',
          onSelect: '&',
          initialSelection: '@',
          treeControl: '=',
          iconexpand: '=',
          iconcollapse: '=',
          iconleaf: '='
        },
        link: function(scope, element, attrs) {
          var error, expandingProperty, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;

          error = function(s) {
            console.log('ERROR:' + s);
            debugger;
            return void 0;
          };


          if (attrs.expandLevel == null) {
            attrs.expandLevel = '3';
          }

          expand_level = parseInt(attrs.expandLevel, 10);

          if (!scope.treeData) {
            alert('no treeData defined for the tree!');
            return;
          }
          if (scope.treeData.length == null) {
            if (treeData.label != null) {
              scope.treeData = [treeData];
            } else {
              alert('treeData should be an array of root branches');
              return;
            }
          }



            var _firstRow = scope.treeData[0], 
                _keys = Object.keys(_firstRow);
            for(var i =0, len = _keys.length; i<len; i++){
              if(typeof(_firstRow[_keys[i]])=='string' && _keys[i]!='id'  && _keys[i]!='parentId' && _keys[i]!='icon' && _keys[i]!='edit' && _keys[i]!='delete'){

                expandingProperty = _keys[i];
                break;
              }
            }

            if(!expandingProperty) expandingProperty = _keys[0];

            scope.expandingProperty = expandingProperty;

          if(scope.expandOn){
            scope.expandingPropertyName = scope.expandOn;
          } else
          {
            scope.expandingPropertyName = scope.expandingProperty;
          }

          if(!attrs.colDefs){
            var _col_defs = [], _firstRow = scope.treeData[0], _unwantedColumn = ['children', 'level', 'expanded', expandingProperty];
            for(var idx in _firstRow){
              if(_unwantedColumn.indexOf(idx)==-1)
                _col_defs.push({field:idx});
            }            
            scope.colDefinitions = _col_defs;
          }
          else{

            scope.colDefinitions = scope.colDefs;
          }

          for_each_branch = function(f) {
            var do_f, root_branch, _i, _len, _ref, _results;
            do_f = function(branch, level) {
              var child, _i, _len, _ref, _results;
              f(branch, level);
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(do_f(child, level + 1));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(do_f(root_branch, 1));
            }
            return _results;
          };
          selected_branch = null;
          select_branch = function(branch) {
            if (!branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              selected_branch = null;
              return;
            }
            if (branch !== selected_branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              branch.selected = true;
              selected_branch = branch;
              expand_all_parents(branch);
              if (branch.onSelect != null) {
                return $timeout(function() {
                  return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };
          scope.user_clicks_branch = function(branch) {
            if (branch !== selected_branch) {
              return select_branch(branch);
            }
          };
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);
            if (parent != null) {
              fn(parent);
              return for_all_ancestors(parent, fn);
            }
          };
          expand_all_parents = function(child) {
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };

          scope.tree_rows = [];

          on_treeData_change = function() {
            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
            for_each_branch(function(b, level) {
              if (!b.uid) {
                return b.uid = "" + Math.random()*Math.random()*Math.random();
              }
            });
            for_each_branch(function(b) {
              var child, _i, _len, _ref, _results;
              if (angular.isArray(b.children)) {
                _ref = b.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(child.parent_uid = b.uid);
                }
                return _results;
              }
            });
            scope.tree_rows = [];
            for_each_branch(function(branch) {
              var child, f;
              if (branch.children) {
                if (branch.children.length > 0) {
                  f = function(e) {
                    if (typeof e === 'string') {
                      return {
                        label: e,
                        children: []
                      };
                    } else {
                      return e;
                    }
                  };
                  return branch.children = (function() {
                    var _i, _len, _ref, _results;
                    _ref = branch.children;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      child = _ref[_i];
                      _results.push(f(child));
                    }
                    return _results;
                  })();
                }
              } else {
                return branch.children = [];
              }
            });
            add_branch_to_list = function(level, branch, visible) {
              var child, child_visible, tree_icon, _i, _len, _ref, _results;
              if (branch.expanded == null) {
                branch.expanded = false;
              }
              if (!branch.children || branch.children.length === 0) {
                tree_icon = scope.iconleaf;
              } else {
                if (branch.expanded) {
                  tree_icon = scope.iconcollapse;
                } else {
                  tree_icon = scope.iconexpand;
                }
              }
              branch.level = level;

              scope.tree_rows.push({
                level: level,
                branch: branch,                
                label: branch[expandingProperty],                
                tree_icon: tree_icon,
                tree_icon_value: branch['icon'],
                visible: visible
              });
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  child_visible = visible && branch.expanded;
                  _results.push(add_branch_to_list(level + 1, child, child_visible));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(add_branch_to_list(1, root_branch, true));
            }
            return _results;
          };

          scope.$watch('treeData', on_treeData_change, true);

          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label === attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          n = scope.treeData.length;
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });
          if (scope.treeControl != null) {
            if (angular.isObject(scope.treeControl)) {
              tree = scope.treeControl;
              tree.expand_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = true;
                });
              };
              tree.collapse_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = false;
                });
              };
              tree.get_first_branch = function() {
                n = scope.treeData.length;
                if (n > 0) {
                  return scope.treeData[0];
                }
              };
              tree.select_first_branch = function() {
                var b;
                b = tree.get_first_branch();
                return tree.select_branch(b);
              };
              tree.get_selected_branch = function() {
                return selected_branch;
              };
              tree.get_parent_branch = function(b) {
                return get_parent(b);
              };
              tree.select_branch = function(b) {
                select_branch(b);
                return b;
              };
              tree.get_children = function(b) {
                return b.children;
              };
              tree.select_parent_branch = function(b) {
                var p;
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p != null) {
                    tree.select_branch(p);
                    return p;
                  }
                }
              };
              tree.add_branch = function(parent, new_branch) {
                if (parent != null) {
                  parent.children.push(new_branch);
                  parent.expanded = true;
                } else {
                  scope.treeData.push(new_branch);
                }
                return new_branch;
              };
              tree.add_root_branch = function(new_branch) {
                tree.add_branch(null, new_branch);
                return new_branch;
              };
              tree.expand_branch = function(b) {
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  b.expanded = true;
                  return b;
                }
              };
              tree.collapse_branch = function(b) {
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  b.expanded = false;
                  return b;
                }
              };
              tree.get_siblings = function(b) {
                var p, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p) {
                    siblings = p.children;
                  } else {
                    siblings = scope.treeData;
                  }
                  return siblings;
                }
              };
              tree.get_next_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i < n) {
                    return siblings[i + 1];
                  }
                }
              };
              tree.get_prev_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i > 0) {
                  return siblings[i - 1];
                }
              };
              tree.select_next_sibling = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return tree.select_branch(next);
                  }
                }
              };
              tree.select_prev_sibling = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_sibling(b);
                  if (prev != null) {
                    return tree.select_branch(prev);
                  }
                }
              };
              tree.get_first_child = function(b) {
                var _ref;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                    return b.children[0];
                  }
                }
              };
              tree.get_closest_ancestor_next_sibling = function(b) {
                var next, parent;
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return next;
                } else {
                  parent = tree.get_parent_branch(b);
                  return tree.get_closest_ancestor_next_sibling(parent);
                }
              };
              tree.get_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_first_child(b);
                  if (next != null) {
                    return next;
                  } else {
                    next = tree.get_closest_ancestor_next_sibling(b);
                    return next;
                  }
                }
              };
              tree.select_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_branch(b);
                  if (next != null) {
                    tree.select_branch(next);
                    return next;
                  }
                }
              };
              tree.last_descendant = function(b) {
                var last_child;
                if (b == null) {
                  debugger;
                }
                n = b.children.length;
                if (n === 0) {
                  return b;
                } else {
                  last_child = b.children[n - 1];
                  return tree.last_descendant(last_child);
                }
              };
              tree.get_prev_branch = function(b) {
                var parent, prev_sibling;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev_sibling = tree.get_prev_sibling(b);
                  if (prev_sibling != null) {
                    return tree.last_descendant(prev_sibling);
                  } else {
                    parent = tree.get_parent_branch(b);
                    return parent;
                  }
                }
              };
              return tree.select_prev_branch = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_branch(b);
                  if (prev != null) {
                    tree.select_branch(prev);
                    return prev;
                  }
                }
              };
            }
          }
        }
      };
    }
  ]);

}).call(this);
;/**
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
;(function () {
    var callWithJQuery,
        __indexOf = [].indexOf || function (item) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this && this[i] === item) return i;
                }
                return -1;
            },
        __slice = [].slice,
        __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        },
        __hasProp = {}.hasOwnProperty;

    callWithJQuery = function (pivotModule) {
        if (typeof exports === "object" && typeof module === "object") {
            return pivotModule(require("jquery"));
        } else if (typeof define === "function" && define.amd) {
            return define(["jquery"], pivotModule);
        } else {
            return pivotModule(jQuery);
        }
    };

    callWithJQuery(function ($) {

        /*
         Utilities
         */
        var PivotData, addSeparators, aggregatorTemplates, aggregators, dayNamesEn, derivers, locales, mthNamesEn, naturalSort, numberFormat, pivotTableRenderer, renderers, usFmt, usFmtInt, usFmtPct, zeroPad;
        addSeparators = function (nStr, thousandsSep, decimalSep) {
            var rgx, x, x1, x2;
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? decimalSep + x[1] : '';
            rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + thousandsSep + '$2');
            }
            return x1 + x2;
        };
        numberFormat = function (opts) {
            var defaults;
            defaults = {
                digitsAfterDecimal: 2,
                scaler: 1,
                thousandsSep: ",",
                decimalSep: ".",
                prefix: "",
                suffix: "",
                showZero: false
            };
            opts = $.extend(defaults, opts);
            return function (x) {
                var result;
                if (isNaN(x) || !isFinite(x)) {
                    return "";
                }
                if (x === 0 && !opts.showZero) {
                    return "";
                }
                result = addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
                return "" + opts.prefix + result + opts.suffix;
            };
        };
        usFmt = numberFormat();
        usFmtInt = numberFormat({
            digitsAfterDecimal: 0
        });
        usFmtPct = numberFormat({
            digitsAfterDecimal: 1,
            scaler: 100,
            suffix: "%"
        });
        aggregatorTemplates = {
            count: function (formatter) {
                if (formatter == null) {
                    formatter = usFmtInt;
                }
                return function () {
                    return function (data, rowKey, colKey) {
                        return {
                            count: 0,
                            push: function () {
                                return this.count++;
                            },
                            value: function () {
                                return this.count;
                            },
                            format: formatter
                        };
                    };
                };
            },
            countUnique: function (formatter) {
                if (formatter == null) {
                    formatter = usFmtInt;
                }
                return function (_arg) {
                    var attr;
                    attr = _arg[0];
                    return function (data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function (record) {
                                var _ref;
                                if (_ref = record[attr], __indexOf.call(this.uniq, _ref) < 0) {
                                    return this.uniq.push(record[attr]);
                                }
                            },
                            value: function () {
                                return this.uniq.length;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            listUnique: function (sep) {
                return function (_arg) {
                    var attr;
                    attr = _arg[0];
                    return function (data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function (record) {
                                var _ref;
                                if (_ref = record[attr], __indexOf.call(this.uniq, _ref) < 0) {
                                    return this.uniq.push(record[attr]);
                                }
                            },
                            value: function () {
                                return this.uniq.join(sep);
                            },
                            format: function (x) {
                                return x;
                            },
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            sum: function (formatter) {
                if (formatter == null) {
                    formatter = usFmt;
                }
                return function (_arg) {
                    var attr;
                    attr = _arg[0];
                    return function (data, rowKey, colKey) {
                        return {
                            sum: 0,
                            push: function (record) {
                                if (!isNaN(parseFloat(record[attr]))) {
                                    return this.sum += parseFloat(record[attr]);
                                }
                            },
                            value: function () {
                                return this.sum;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            average: function (formatter) {
                if (formatter == null) {
                    formatter = usFmt;
                }
                return function (_arg) {
                    var attr;
                    attr = _arg[0];
                    return function (data, rowKey, colKey) {
                        return {
                            sum: 0,
                            len: 0,
                            push: function (record) {
                                if (!isNaN(parseFloat(record[attr]))) {
                                    this.sum += parseFloat(record[attr]);
                                    return this.len++;
                                }
                            },
                            value: function () {
                                return this.sum / this.len;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            sumOverSum: function (formatter) {
                if (formatter == null) {
                    formatter = usFmt;
                }
                return function (_arg) {
                    var denom, num;
                    num = _arg[0], denom = _arg[1];
                    return function (data, rowKey, colKey) {
                        return {
                            sumNum: 0,
                            sumDenom: 0,
                            push: function (record) {
                                if (!isNaN(parseFloat(record[num]))) {
                                    this.sumNum += parseFloat(record[num]);
                                }
                                if (!isNaN(parseFloat(record[denom]))) {
                                    return this.sumDenom += parseFloat(record[denom]);
                                }
                            },
                            value: function () {
                                return this.sumNum / this.sumDenom;
                            },
                            format: formatter,
                            numInputs: (num != null) && (denom != null) ? 0 : 2
                        };
                    };
                };
            },
            sumOverSumBound80: function (upper, formatter) {
                if (upper == null) {
                    upper = true;
                }
                if (formatter == null) {
                    formatter = usFmt;
                }
                return function (_arg) {
                    var denom, num;
                    num = _arg[0], denom = _arg[1];
                    return function (data, rowKey, colKey) {
                        return {
                            sumNum: 0,
                            sumDenom: 0,
                            push: function (record) {
                                if (!isNaN(parseFloat(record[num]))) {
                                    this.sumNum += parseFloat(record[num]);
                                }
                                if (!isNaN(parseFloat(record[denom]))) {
                                    return this.sumDenom += parseFloat(record[denom]);
                                }
                            },
                            value: function () {
                                var sign;
                                sign = upper ? 1 : -1;
                                return (0.821187207574908 / this.sumDenom + this.sumNum / this.sumDenom + 1.2815515655446004 * sign * Math.sqrt(0.410593603787454 / (this.sumDenom * this.sumDenom) + (this.sumNum * (1 - this.sumNum / this.sumDenom)) / (this.sumDenom * this.sumDenom))) / (1 + 1.642374415149816 / this.sumDenom);
                            },
                            format: formatter,
                            numInputs: (num != null) && (denom != null) ? 0 : 2
                        };
                    };
                };
            },
            fractionOf: function (wrapped, type, formatter) {
                if (type == null) {
                    type = "total";
                }
                if (formatter == null) {
                    formatter = usFmtPct;
                }
                return function () {
                    var x;
                    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    return function (data, rowKey, colKey) {
                        return {
                            selector: {
                                total: [[], []],
                                row: [rowKey, []],
                                col: [[], colKey]
                            }[type],
                            inner: wrapped.apply(null, x)(data, rowKey, colKey),
                            push: function (record) {
                                return this.inner.push(record);
                            },
                            format: formatter,
                            value: function () {
                                return this.inner.value() / data.getAggregator.apply(data, this.selector).inner.value();
                            },
                            numInputs: wrapped.apply(null, x)().numInputs
                        };
                    };
                };
            }
        };
        aggregators = (function (tpl) {
            return {
                "Count": tpl.count(usFmtInt),
                "Count Unique Values": tpl.countUnique(usFmtInt),
                "List Unique Values": tpl.listUnique(", "),
                "Sum": tpl.sum(usFmt),
                "Integer Sum": tpl.sum(usFmtInt),
                "Average": tpl.average(usFmt),
                "Sum over Sum": tpl.sumOverSum(usFmt),
                "80% Upper Bound": tpl.sumOverSumBound80(true, usFmt),
                "80% Lower Bound": tpl.sumOverSumBound80(false, usFmt),
                "Sum as Fraction of Total": tpl.fractionOf(tpl.sum(), "total", usFmtPct),
                "Sum as Fraction of Rows": tpl.fractionOf(tpl.sum(), "row", usFmtPct),
                "Sum as Fraction of Columns": tpl.fractionOf(tpl.sum(), "col", usFmtPct),
                "Count as Fraction of Total": tpl.fractionOf(tpl.count(), "total", usFmtPct),
                "Count as Fraction of Rows": tpl.fractionOf(tpl.count(), "row", usFmtPct),
                "Count as Fraction of Columns": tpl.fractionOf(tpl.count(), "col", usFmtPct)
            };
        })(aggregatorTemplates);
        renderers = {
            "Table": function (pvtData, opts) {
                return pivotTableRenderer(pvtData, opts);
            },
            "Table Barchart": function (pvtData, opts) {
                return $(pivotTableRenderer(pvtData, opts)).barchart();
            },
            "Heatmap": function (pvtData, opts) {
                return $(pivotTableRenderer(pvtData, opts)).heatmap();
            },
            "Row Heatmap": function (pvtData, opts) {
                return $(pivotTableRenderer(pvtData, opts)).heatmap("rowheatmap");
            },
            "Col Heatmap": function (pvtData, opts) {
                return $(pivotTableRenderer(pvtData, opts)).heatmap("colheatmap");
            }
        };
        locales = {
            en: {
                aggregators: aggregators,
                renderers: renderers,
                localeStrings: {
                    renderError: "An error occurred rendering the PivotTable results.",
                    computeError: "An error occurred computing the PivotTable results.",
                    uiRenderError: "An error occurred rendering the PivotTable UI.",
                    selectAll: "Select All",
                    selectNone: "Select None",
                    tooMany: "(too many to list)",
                    filterResults: "Filter results",
                    totals: "Totals",
                    vs: "vs",
                    by: "by"
                }
            }
        };
        mthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        zeroPad = function (number) {
            return ("0" + number).substr(-2, 2);
        };
        derivers = {
            bin: function (col, binWidth) {
                return function (record) {
                    return record[col] - record[col] % binWidth;
                };
            },
            dateFormat: function (col, formatString, mthNames, dayNames) {
                if (mthNames == null) {
                    mthNames = mthNamesEn;
                }
                if (dayNames == null) {
                    dayNames = dayNamesEn;
                }
                return function (record) {
                    var date;
                    date = new Date(Date.parse(record[col]));
                    if (isNaN(date)) {
                        return "";
                    }
                    return formatString.replace(/%(.)/g, function (m, p) {
                        switch (p) {
                            case "y":
                                return date.getFullYear();
                            case "m":
                                return zeroPad(date.getMonth() + 1);
                            case "n":
                                return mthNames[date.getMonth()];
                            case "d":
                                return zeroPad(date.getDate());
                            case "w":
                                return dayNames[date.getDay()];
                            case "x":
                                return date.getDay();
                            case "H":
                                return zeroPad(date.getHours());
                            case "M":
                                return zeroPad(date.getMinutes());
                            case "S":
                                return zeroPad(date.getSeconds());
                            default:
                                return "%" + p;
                        }
                    });
                };
            }
        };
        naturalSort = (function (_this) {
            return function (as, bs) {
                var a, a1, b, b1, rd, rx, rz;
                rx = /(\d+)|(\D+)/g;
                rd = /\d/;
                rz = /^0/;
                if (typeof as === "number" || typeof bs === "number") {
                    if (isNaN(as)) {
                        return 1;
                    }
                    if (isNaN(bs)) {
                        return -1;
                    }
                    return as - bs;
                }
                a = String(as).toLowerCase();
                b = String(bs).toLowerCase();
                if (a === b) {
                    return 0;
                }
                if (!(rd.test(a) && rd.test(b))) {
                    return (a > b ? 1 : -1);
                }
                a = a.match(rx);
                b = b.match(rx);
                while (a.length && b.length) {
                    a1 = a.shift();
                    b1 = b.shift();
                    if (a1 !== b1) {
                        if (rd.test(a1) && rd.test(b1)) {
                            return a1.replace(rz, ".0") - b1.replace(rz, ".0");
                        } else {
                            return (a1 > b1 ? 1 : -1);
                        }
                    }
                }
                return a.length - b.length;
            };
        })(this);
        $.pivotUtilities = {
            aggregatorTemplates: aggregatorTemplates,
            aggregators: aggregators,
            renderers: renderers,
            derivers: derivers,
            locales: locales,
            naturalSort: naturalSort,
            numberFormat: numberFormat
        };

        /*
         Data Model class
         */
        PivotData = (function () {
            function PivotData(input, opts) {
                this.getAggregator = __bind(this.getAggregator, this);
                this.getRowKeys = __bind(this.getRowKeys, this);
                this.getColKeys = __bind(this.getColKeys, this);
                this.sortKeys = __bind(this.sortKeys, this);
                this.arrSort = __bind(this.arrSort, this);
                this.natSort = __bind(this.natSort, this);
                this.aggregator = opts.aggregator;
                this.aggregatorName = opts.aggregatorName;
                this.colAttrs = opts.cols;
                this.rowAttrs = opts.rows;
                this.valAttrs = opts.vals;
                this.tree = {};
                this.rowKeys = [];
                this.colKeys = [];
                this.rowTotals = {};
                this.colTotals = {};
                this.allTotal = this.aggregator(this, [], []);
                this.sorted = false;
                PivotData.forEachRecord(input, opts.derivedAttributes, (function (_this) {
                    return function (record) {
                        if (opts.filter(record)) {
                            return _this.processRecord(record);
                        }
                    };
                })(this));
            }

            PivotData.forEachRecord = function (input, derivedAttributes, f) {
                var addRecord, compactRecord, i, j, k, record, tblCols, _i, _len, _ref, _results, _results1;
                if ($.isEmptyObject(derivedAttributes)) {
                    addRecord = f;
                } else {
                    addRecord = function (record) {
                        var k, v, _ref;
                        for (k in derivedAttributes) {
                            v = derivedAttributes[k];
                            record[k] = (_ref = v(record)) != null ? _ref : record[k];
                        }
                        return f(record);
                    };
                }
                if ($.isFunction(input)) {
                    return input(addRecord);
                } else if ($.isArray(input)) {
                    if ($.isArray(input[0])) {
                        _results = [];
                        for (i in input) {
                            if (!__hasProp.call(input, i)) continue;
                            compactRecord = input[i];
                            if (!(i > 0)) {
                                continue;
                            }
                            record = {};
                            _ref = input[0];
                            for (j in _ref) {
                                if (!__hasProp.call(_ref, j)) continue;
                                k = _ref[j];
                                record[k] = compactRecord[j];
                            }
                            _results.push(addRecord(record));
                        }
                        return _results;
                    } else {
                        _results1 = [];
                        for (_i = 0, _len = input.length; _i < _len; _i++) {
                            record = input[_i];
                            _results1.push(addRecord(record));
                        }
                        return _results1;
                    }
                } else if (input instanceof jQuery) {
                    tblCols = [];
                    $("thead > tr > th", input).each(function (i) {
                        return tblCols.push($(this).text());
                    });
                    return $("tbody > tr", input).each(function (i) {
                        record = {};
                        $("td", this).each(function (j) {
                            return record[tblCols[j]] = $(this).text();
                        });
                        return addRecord(record);
                    });
                } else {
                    throw new Error("unknown input format");
                }
            };

            PivotData.convertToArray = function (input) {
                var result;
                result = [];
                PivotData.forEachRecord(input, {}, function (record) {
                    return result.push(record);
                });
                return result;
            };

            PivotData.prototype.natSort = function (as, bs) {
                return naturalSort(as, bs);
            };

            PivotData.prototype.arrSort = function (a, b) {
                return this.natSort(a.join(), b.join());
            };

            PivotData.prototype.sortKeys = function () {
                if (!this.sorted) {
                    this.rowKeys.sort(this.arrSort);
                    this.colKeys.sort(this.arrSort);
                }
                return this.sorted = true;
            };

            PivotData.prototype.getColKeys = function () {
                this.sortKeys();
                return this.colKeys;
            };

            PivotData.prototype.getRowKeys = function () {
                this.sortKeys();
                return this.rowKeys;
            };

            PivotData.prototype.processRecord = function (record) {
                var colKey, flatColKey, flatRowKey, rowKey, x, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
                colKey = [];
                rowKey = [];
                _ref = this.colAttrs;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    x = _ref[_i];
                    colKey.push((_ref1 = record[x]) != null ? _ref1 : "null");
                }
                _ref2 = this.rowAttrs;
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                    x = _ref2[_j];
                    rowKey.push((_ref3 = record[x]) != null ? _ref3 : "null");
                }
                flatRowKey = rowKey.join(String.fromCharCode(0));
                flatColKey = colKey.join(String.fromCharCode(0));
                this.allTotal.push(record);
                if (rowKey.length !== 0) {
                    if (!this.rowTotals[flatRowKey]) {
                        this.rowKeys.push(rowKey);
                        this.rowTotals[flatRowKey] = this.aggregator(this, rowKey, []);
                    }
                    this.rowTotals[flatRowKey].push(record);
                }
                if (colKey.length !== 0) {
                    if (!this.colTotals[flatColKey]) {
                        this.colKeys.push(colKey);
                        this.colTotals[flatColKey] = this.aggregator(this, [], colKey);
                    }
                    this.colTotals[flatColKey].push(record);
                }
                if (colKey.length !== 0 && rowKey.length !== 0) {
                    if (!this.tree[flatRowKey]) {
                        this.tree[flatRowKey] = {};
                    }
                    if (!this.tree[flatRowKey][flatColKey]) {
                        this.tree[flatRowKey][flatColKey] = this.aggregator(this, rowKey, colKey);
                    }
                    return this.tree[flatRowKey][flatColKey].push(record);
                }
            };

            PivotData.prototype.getAggregator = function (rowKey, colKey) {
                var agg, flatColKey, flatRowKey;
                flatRowKey = rowKey.join(String.fromCharCode(0));
                flatColKey = colKey.join(String.fromCharCode(0));
                if (rowKey.length === 0 && colKey.length === 0) {
                    agg = this.allTotal;
                } else if (rowKey.length === 0) {
                    agg = this.colTotals[flatColKey];
                } else if (colKey.length === 0) {
                    agg = this.rowTotals[flatRowKey];
                } else {
                    agg = this.tree[flatRowKey][flatColKey];
                }
                return agg != null ? agg : {
                    value: (function () {
                        return null;
                    }),
                    format: function () {
                        return "";
                    }
                };
            };

            return PivotData;

        })();

        /*
         Default Renderer for hierarchical table layout
         */
        pivotTableRenderer = function (pivotData, opts) {

            var aggregator, c, colAttrs, colKey, colKeys, defaults, i, j, r, result, rowAttrs, rowKey, rowKeys, spanSize, td, th, totalAggregator, tr, txt, val, x;
            defaults = {
                localeStrings: {
                    totals: "Totals"
                }
            };
            opts = $.extend(defaults, opts);
            colAttrs = pivotData.colAttrs;
            rowAttrs = pivotData.rowAttrs;
            rowKeys = pivotData.getRowKeys();
            colKeys = pivotData.getColKeys();
            result = document.createElement("table");
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");
            result.className = "table table-bordered table-condensed table-striped table-hover ";
            spanSize = function (arr, i, j) {
                var len, noDraw, stop, x, _i, _j;
                if (i !== 0) {
                    noDraw = true;
                    for (x = _i = 0; 0 <= j ? _i <= j : _i >= j; x = 0 <= j ? ++_i : --_i) {
                        if (arr[i - 1][x] !== arr[i][x]) {
                            noDraw = false;
                        }
                    }
                    if (noDraw) {
                        return -1;
                    }
                }
                len = 0;
                while (i + len < arr.length) {
                    stop = false;
                    for (x = _j = 0; 0 <= j ? _j <= j : _j >= j; x = 0 <= j ? ++_j : --_j) {
                        if (arr[i][x] !== arr[i + len][x]) {
                            stop = true;
                        }
                    }
                    if (stop) {
                        break;
                    }
                    len++;
                }
                return len;
            };
            for (j in colAttrs) {
                if (!__hasProp.call(colAttrs, j)) continue;
                c = colAttrs[j];
                tr = document.createElement("tr");
                if (parseInt(j) === 0 && rowAttrs.length !== 0) {
                    th = document.createElement("th");
                    th.setAttribute("colspan", rowAttrs.length);
                    th.setAttribute("rowspan", colAttrs.length);
                    tr.appendChild(th);
                }
                th = document.createElement("th");
                th.className = "pvtAxisLabel";
                th.textContent = c;
                tr.appendChild(th);
                for (i in colKeys) {
                    if (!__hasProp.call(colKeys, i)) continue;
                    colKey = colKeys[i];
                    x = spanSize(colKeys, parseInt(i), parseInt(j));
                    if (x !== -1) {
                        th = document.createElement("th");
                        th.className = "pvtColLabel";
                        th.textContent = colKey[j];
                        th.setAttribute("colspan", x);
                        if (parseInt(j) === colAttrs.length - 1 && rowAttrs.length !== 0) {
                            th.setAttribute("rowspan", 2);
                        }
                        tr.appendChild(th);
                    }
                }
                if (parseInt(j) === 0) {
                    th = document.createElement("th");
                    th.className = "pvtTotalLabel";
                    th.innerHTML = opts.localeStrings.totals;
                    th.setAttribute("rowspan", colAttrs.length + (rowAttrs.length === 0 ? 0 : 1));
                    tr.appendChild(th);
                }
                tbody.appendChild(tr);
            }
            if (rowAttrs.length !== 0) {
                tr = document.createElement("tr");
                for (i in rowAttrs) {
                    if (!__hasProp.call(rowAttrs, i)) continue;
                    r = rowAttrs[i];
                    th = document.createElement("th");
                    th.className = "pvtAxisLabel";
                    th.textContent = r;
                    tr.appendChild(th);
                }
                th = document.createElement("th");
                if (colAttrs.length === 0) {
                    th.className = "pvtTotalLabel";
                    th.innerHTML = opts.localeStrings.totals;
                }
                tr.appendChild(th);
                tbody.appendChild(tr);
            }
            for (i in rowKeys) {
                if (!__hasProp.call(rowKeys, i)) continue;
                rowKey = rowKeys[i];
                tr = document.createElement("tr");
                for (j in rowKey) {
                    if (!__hasProp.call(rowKey, j)) continue;
                    txt = rowKey[j];
                    x = spanSize(rowKeys, parseInt(i), parseInt(j));
                    if (x !== -1) {
                        th = document.createElement("td");
                        th.className = "pvtRowLabel";
                        th.textContent = txt;
                        th.setAttribute("rowspan", x);
                        if (parseInt(j) === rowAttrs.length - 1 && colAttrs.length !== 0) {
                            th.setAttribute("colspan", 2);
                        }
                        tr.appendChild(th);
                    }
                }
                for (j in colKeys) {
                    if (!__hasProp.call(colKeys, j)) continue;
                    colKey = colKeys[j];
                    aggregator = pivotData.getAggregator(rowKey, colKey);
                    val = aggregator.value();
                    td = document.createElement("td");
                    td.className = "pvtVal row" + i + " col" + j;
                    td.innerHTML = aggregator.format(val);
                    td.setAttribute("data-value", val);
                    tr.appendChild(td);
                }
                totalAggregator = pivotData.getAggregator(rowKey, []);
                val = totalAggregator.value();
                td = document.createElement("td");
                td.className = "pvtTotal rowTotal";
                td.innerHTML = totalAggregator.format(val);
                td.setAttribute("data-value", val);
                td.setAttribute("data-for", "row" + i);
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            tr = document.createElement("tr");
            th = document.createElement("td");
            th.className = "pvtTotalLabel";
            th.innerHTML = opts.localeStrings.totals;
            th.setAttribute("colspan", rowAttrs.length + (colAttrs.length === 0 ? 0 : 1));
            tr.appendChild(th);
            for (j in colKeys) {
                if (!__hasProp.call(colKeys, j)) continue;
                colKey = colKeys[j];
                totalAggregator = pivotData.getAggregator([], colKey);
                val = totalAggregator.value();
                td = document.createElement("td");
                td.className = "pvtTotal colTotal";
                td.innerHTML = totalAggregator.format(val);
                td.setAttribute("data-value", val);
                td.setAttribute("data-for", "col" + j);
                tr.appendChild(td);
            }
            totalAggregator = pivotData.getAggregator([], []);
            val = totalAggregator.value();
            td = document.createElement("td");
            td.className = "pvtGrandTotal";
            td.innerHTML = totalAggregator.format(val);
            td.setAttribute("data-value", val);
            tr.appendChild(td);
            tbody.appendChild(tr);
            result.appendChild(tbody)
            result.setAttribute("data-numrows", rowKeys.length);
            result.setAttribute("data-numcols", colKeys.length);
            return result;
        };

        /*
         Pivot Table core: create PivotData object and call Renderer on it
         */
        $.fn.pivot = function (input, opts) {
            var defaults, e, pivotData, result, x;
            defaults = {
                cols: [],
                rows: [],
                filter: function () {
                    return true;
                },
                aggregator: aggregatorTemplates.count()(),
                aggregatorName: "Count",
                derivedAttributes: {},
                renderer: pivotTableRenderer,
                rendererOptions: null,
                localeStrings: locales.en.localeStrings
            };
            opts = $.extend(defaults, opts);
            result = null;
            try {

                pivotData = new PivotData(input, opts);

                try {
                    result = opts.renderer(pivotData, opts.rendererOptions);
                } catch (_error) {
                    e = _error;
                    if (typeof console !== "undefined" && console !== null) {
                        console.error(e.stack);
                    }
                    result = $("<span>").html(opts.localeStrings.renderError);
                }
            } catch (_error) {
                e = _error;
                if (typeof console !== "undefined" && console !== null) {
                    console.error(e.stack);
                }
                result = $("<span>").html(opts.localeStrings.computeError);
            }
            x = this[0];
            while (x.hasChildNodes()) {
                x.removeChild(x.lastChild);
            }
            return this.append(result);
        };

        /*
         Pivot Table UI: calls Pivot Table core above with options set by user
         */
        $.fn.pivotUI = function (input, inputOpts, overwrite, locale) {
            var a, aggregator, attrLength, axisValues, c, colList, defaults, e, existingOpts, i, initialRender, k, opts, pivotTable, refresh, refreshDelayed, renderer, rendererControl, shownAttributes, tblCols, tr1, tr2, uiTable, uiTody, unusedAttrsVerticalAutoOverride, x, _fn, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
            if (overwrite == null) {
                overwrite = false;
            }
            if (locale == null) {
                locale = "es";
            }
            defaults = {
                derivedAttributes: {},
                aggregators: locales[locale].aggregators,
                renderers: locales[locale].renderers,
                hiddenAttributes: [],
                menuLimit: 200,
                cols: [],
                rows: [],
                vals: [],
                exclusions: {},
                unusedAttrsVertical: "auto",
                autoSortUnusedAttrs: false,
                rendererOptions: {
                    localeStrings: locales[locale].localeStrings
                },
                onRefresh: null,
                filter: function () {
                    return true;
                },
                localeStrings: locales[locale].localeStrings
            };
            existingOpts = this.data("pivotUIOptions");
            if ((existingOpts == null) || overwrite) {
                opts = $.extend(defaults, inputOpts);
            } else {
                opts = existingOpts;
            }
            try {
                input = PivotData.convertToArray(input);
                tblCols = (function () {
                    var _ref, _results;
                    _ref = input[0];
                    _results = [];
                    for (k in _ref) {
                        if (k !== '$$hashKey' && k !== 'id' && k !== 'parentId' ) {

                            if (!__hasProp.call(_ref, k)) continue;
                            _results.push(k);
                        }
                    }
                    return _results;
                })();
                _ref = opts.derivedAttributes;
                for (c in _ref) {
                    if (!__hasProp.call(_ref, c)) continue;
                    if ((__indexOf.call(tblCols, c) < 0)) {
                        tblCols.push(c);
                    }
                }
                axisValues = {};
                for (_i = 0, _len = tblCols.length; _i < _len; _i++) {
                    x = tblCols[_i];
                    axisValues[x] = {};
                }

                PivotData.forEachRecord(input, opts.derivedAttributes, function (record) {
                    var v, _base, _results;
                    _results = [];
                    for (k in record) {
                        if (k !== '$$hashKey' && k !== 'id' && k !== 'parentId' ) {
                            if (!__hasProp.call(record, k)) continue;
                            v = record[k];
                            if (!(opts.filter(record))) {
                                continue;
                            }
                            if (v == null) {
                                v = "null";
                            }

                            if ((_base = axisValues[k])[v] == null) {
                                _base[v] = 0;
                            }
                            _results.push(axisValues[k][v]++);
                        }
                    }
                    return _results;
                });
                uiTable = $("<table class='table   table-bordered table-condensed table-striped table-hover' cellpadding='5'>");
                uiTody=$("<tbody>").appendTo(uiTable);
                rendererControl = $("<td class='col-md-1'>");
                renderer = $("<select class='pvtRenderer'>").appendTo(rendererControl).bind("change", function () {
                    return refresh();
                });
                _ref1 = opts.renderers;
                for (x in _ref1) {
                    if (!__hasProp.call(_ref1, x)) continue;
                    $("<option>").val(x).html(x).appendTo(renderer);
                }
                colList = $("<td class='pvtAxisContainer pvtUnused'>");
                shownAttributes = (function () {
                    var _j, _len1, _results;
                    _results = [];
                    for (_j = 0, _len1 = tblCols.length; _j < _len1; _j++) {
                        c = tblCols[_j];
                        if (__indexOf.call(opts.hiddenAttributes, c) < 0) {
                            _results.push(c);
                        }
                    }
                    return _results;
                })();
                unusedAttrsVerticalAutoOverride = false;
                if (opts.unusedAttrsVertical === "auto") {
                    attrLength = 0;
                    for (_j = 0, _len1 = shownAttributes.length; _j < _len1; _j++) {
                        a = shownAttributes[_j];
                        attrLength += a.length;
                    }
                    unusedAttrsVerticalAutoOverride = attrLength > 120;
                }
                if (opts.unusedAttrsVertical === true || unusedAttrsVerticalAutoOverride) {
                    colList.addClass('pvtVertList');
                } else {
                    colList.addClass('pvtHorizList');
                }
                _fn = function (c) {
                    var attrElem, btns, checkContainer, filterItem, filterItemExcluded, hasExcludedItem, keys, showFilterList, triangleLink, updateFilter, v, valueList, _k, _len2, _ref2;
                    keys = (function () {
                        var _results;
                        _results = [];
                        for (k in axisValues[c]) {
                            _results.push(k);
                        }
                        return _results;
                    })();
                    hasExcludedItem = false;
                    valueList = $("<div>").addClass('pvtFilterBox').hide();
                    valueList.append($("<h4>").text("" + c + " (" + keys.length + ")"));
                    if (keys.length > opts.menuLimit) {
                        valueList.append($("<p>").html(opts.localeStrings.tooMany));
                    } else {
                        btns = $("<p>").appendTo(valueList);
                        btns.append($("<button>").html(opts.localeStrings.selectAll).bind("click", function () {
                            return valueList.find("input:visible").prop("checked", true);
                        }));
                        btns.append($("<button>").html(opts.localeStrings.selectNone).bind("click", function () {
                            return valueList.find("input:visible").prop("checked", false);
                        }));
                        btns.append($("<input>").addClass("pvtSearch").attr("placeholder", opts.localeStrings.filterResults).bind("keyup", function () {
                            var filter;
                            filter = $(this).val().toLowerCase();
                            return $(this).parents(".pvtFilterBox").find('label span').each(function () {
                                var testString;
                                testString = $(this).text().toLowerCase().indexOf(filter);
                                if (testString !== -1) {
                                    return $(this).parent().show();
                                } else {
                                    return $(this).parent().hide();
                                }
                            });
                        }));
                        checkContainer = $("<div>").addClass("pvtCheckContainer").appendTo(valueList);
                        _ref2 = keys.sort(naturalSort);
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            k = _ref2[_k];
                            v = axisValues[c][k];
                            filterItem = $("<label>");
                            filterItemExcluded = opts.exclusions[c] ? (__indexOf.call(opts.exclusions[c], k) >= 0) : false;
                            hasExcludedItem || (hasExcludedItem = filterItemExcluded);
                            $("<input type='checkbox' class='pvtFilter'>").attr("checked", !filterItemExcluded).data("filter", [c, k]).appendTo(filterItem);
                            filterItem.append($("<span>").text("" + k + " (" + v + ")"));
                            checkContainer.append($("<p>").append(filterItem));
                        }
                    }
                    updateFilter = function () {
                        var unselectedCount;
                        unselectedCount = $(valueList).find("[type='checkbox']").length - $(valueList).find("[type='checkbox']:checked").length;
                        if (unselectedCount > 0) {
                            attrElem.addClass("pvtFilteredAttribute");
                        } else {
                            attrElem.removeClass("pvtFilteredAttribute");
                        }
                        if (keys.length > opts.menuLimit) {
                            return valueList.toggle();
                        } else {
                            return valueList.toggle(0, refresh);
                        }
                    };
                    $("<p>").appendTo(valueList).append($("<button>").text("OK").bind("click", updateFilter));
                    showFilterList = function (e) {
                        valueList.css({
                            left: e.pageX,
                            top: e.pageY
                        }).toggle();
                        $('.pvtSearch').val('');
                        return $('label').show();
                    };
                    triangleLink = $("<span class='pvtTriangle' style='color:white'>").html(" &#x25BE;").bind("click", showFilterList);
                    attrElem = $("<li class='axis_" + i + "'>").append($("<span class='label label-info pvtAttr'>").text(c).data("attrName", c).append(triangleLink));
                    if (hasExcludedItem) {
                        attrElem.addClass('pvtFilteredAttribute');
                    }
                    colList.append(attrElem).append(valueList);
                    return attrElem.bind("dblclick", showFilterList);
                };
                for (i in shownAttributes) {
                    c = shownAttributes[i];
                    _fn(c);
                }
                tr1 = $("<tr>").appendTo(uiTody);
                aggregator = $("<select class='pvtAggregator'>").bind("change", function () {
                    return refresh();
                });
                _ref2 = opts.aggregators;
                for (x in _ref2) {
                    if (!__hasProp.call(_ref2, x)) continue;
                    aggregator.append($("<option>").val(x).html(x));
                }
                $("<td class='pvtVals'>").appendTo(tr1).append(aggregator).append($("<br>"));
                $("<td class='pvtAxisContainer pvtHorizList pvtCols'>").appendTo(tr1);
                tr2 = $("<tr>").appendTo(uiTody);
                tr2.append($("<td valign='top' class='pvtAxisContainer pvtRows'>"));
                pivotTable = $("<td valign='top' class='pvtRendererArea'>").appendTo(tr2);
                if (opts.unusedAttrsVertical === true || unusedAttrsVerticalAutoOverride) {
                    uiTable.find('tr:nth-child(1)').prepend(rendererControl);
                    uiTable.find('tr:nth-child(2)').prepend(colList);
                } else {
                    uiTable.prepend($("<tr>").append(rendererControl).append(colList));
                }

                this.html(uiTable);
                _ref3 = opts.cols;
                for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                    x = _ref3[_k];
                    this.find(".pvtCols").append(this.find(".axis_" + (shownAttributes.indexOf(x))));
                }
                _ref4 = opts.rows;
                for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
                    x = _ref4[_l];
                    this.find(".pvtRows").append(this.find(".axis_" + (shownAttributes.indexOf(x))));
                }
                if (opts.aggregatorName != null) {
                    this.find(".pvtAggregator").val(opts.aggregatorName);
                }
                if (opts.rendererName != null) {
                    this.find(".pvtRenderer").val(opts.rendererName);
                }
                initialRender = true;
                refreshDelayed = (function (_this) {
                    return function () {
                        var attr, exclusions, natSort, newDropdown, numInputsToProcess, pivotUIOptions, pvtVals, subopts, unusedAttrsContainer, vals, _len4, _m, _n, _ref5;
                        subopts = {
                            derivedAttributes: opts.derivedAttributes,
                            localeStrings: opts.localeStrings,
                            rendererOptions: opts.rendererOptions,
                            cols: [],
                            rows: []
                        };
                        numInputsToProcess = (_ref5 = opts.aggregators[aggregator.val()]([])().numInputs) != null ? _ref5 : 0;
                        vals = [];
                        _this.find(".pvtRows li span.pvtAttr").each(function () {
                            return subopts.rows.push($(this).data("attrName"));
                        });
                        _this.find(".pvtCols li span.pvtAttr").each(function () {
                            return subopts.cols.push($(this).data("attrName"));
                        });
                        _this.find(".pvtVals select.pvtAttrDropdown").each(function () {
                            if (numInputsToProcess === 0) {
                                return $(this).remove();
                            } else {
                                numInputsToProcess--;
                                if ($(this).val() !== "") {
                                    return vals.push($(this).val());
                                }
                            }
                        });
                        if (numInputsToProcess !== 0) {
                            pvtVals = _this.find(".pvtVals");
                            for (x = _m = 0; 0 <= numInputsToProcess ? _m < numInputsToProcess : _m > numInputsToProcess; x = 0 <= numInputsToProcess ? ++_m : --_m) {
                                newDropdown = $("<select class='pvtAttrDropdown'>").append($("<option>")).bind("change", function () {
                                    return refresh();
                                });
                                for (_n = 0, _len4 = shownAttributes.length; _n < _len4; _n++) {
                                    attr = shownAttributes[_n];
                                    newDropdown.append($("<option>").val(attr).text(attr));
                                }
                                pvtVals.append(newDropdown);
                            }
                        }
                        if (initialRender) {
                            vals = opts.vals;
                            i = 0;
                            _this.find(".pvtVals select.pvtAttrDropdown").each(function () {
                                $(this).val(vals[i]);
                                return i++;
                            });
                            initialRender = false;
                        }
                        subopts.aggregatorName = aggregator.val();
                        subopts.vals = vals;
                        subopts.aggregator = opts.aggregators[aggregator.val()](vals);
                        subopts.renderer = opts.renderers[renderer.val()];
                        exclusions = {};
                        _this.find('input.pvtFilter').not(':checked').each(function () {
                            var filter;
                            filter = $(this).data("filter");
                            if (exclusions[filter[0]] != null) {
                                return exclusions[filter[0]].push(filter[1]);
                            } else {
                                return exclusions[filter[0]] = [filter[1]];
                            }
                        });
                        subopts.filter = function (record) {
                            var excludedItems, _ref6;
                            if (!opts.filter(record)) {
                                return false;
                            }
                            for (k in exclusions) {
                                excludedItems = exclusions[k];
                                if (_ref6 = "" + record[k], __indexOf.call(excludedItems, _ref6) >= 0) {
                                    return false;
                                }
                            }
                            return true;
                        };

                        pivotTable.pivot(input, subopts);
                        pivotUIOptions = $.extend(opts, {
                            cols: subopts.cols,
                            rows: subopts.rows,
                            vals: vals,
                            exclusions: exclusions,
                            aggregatorName: aggregator.val(),
                            rendererName: renderer.val()
                        });
                        _this.data("pivotUIOptions", pivotUIOptions);
                        if (opts.autoSortUnusedAttrs) {
                            natSort = $.pivotUtilities.naturalSort;
                            unusedAttrsContainer = _this.find("td.pvtUnused.pvtAxisContainer");
                            $(unusedAttrsContainer).children("li").sort(function (a, b) {
                                return natSort($(a).text(), $(b).text());
                            }).appendTo(unusedAttrsContainer);
                        }
                        pivotTable.css("opacity", 1);
                        if (opts.onRefresh != null) {
                            return opts.onRefresh(pivotUIOptions);
                        }
                    };
                })(this);
                refresh = (function (_this) {
                    return function () {
                        pivotTable.css("opacity", 0.5);
                        return setTimeout(refreshDelayed, 10);
                    };
                })(this);
                refresh();
                this.find(".pvtAxisContainer").sortable({
                    update: function (e, ui) {
                        if (ui.sender == null) {
                            return refresh();
                        }
                    },
                    connectWith: this.find(".pvtAxisContainer"),
                    items: 'li',
                    placeholder: 'pvtPlaceholder'
                });
            } catch (_error) {
                e = _error;
                if (typeof console !== "undefined" && console !== null) {
                    console.error(e.stack);
                }
                this.html(opts.localeStrings.uiRenderError);
            }
            return this;
        };

        /*
         Heatmap post-processing
         */
        $.fn.heatmap = function (scope) {
            var colorGen, heatmapper, i, j, numCols, numRows, _i, _j;
            if (scope == null) {
                scope = "heatmap";
            }
            numRows = this.data("numrows");
            numCols = this.data("numcols");
            colorGen = function (color, min, max) {
                var hexGen;
                hexGen = (function () {
                    switch (color) {
                        case "red":
                            return function (hex) {
                                return "ff" + hex + hex;
                            };
                        case "green":
                            return function (hex) {
                                return "" + hex + "ff" + hex;
                            };
                        case "blue":
                            return function (hex) {
                                return "" + hex + hex + "ff";
                            };
                    }
                })();
                return function (x) {
                    var hex, intensity;
                    intensity = 255 - Math.round(255 * (x - min) / (max - min));
                    hex = intensity.toString(16).split(".")[0];
                    if (hex.length === 1) {
                        hex = 0 + hex;
                    }
                    return hexGen(hex);
                };
            };
            heatmapper = (function (_this) {
                return function (scope, color) {
                    var colorFor, forEachCell, values;
                    forEachCell = function (f) {
                        return _this.find(scope).each(function () {
                            var x;
                            x = $(this).data("value");
                            if ((x != null) && isFinite(x)) {
                                return f(x, $(this));
                            }
                        });
                    };
                    values = [];
                    forEachCell(function (x) {
                        return values.push(x);
                    });
                    colorFor = colorGen(color, Math.min.apply(Math, values), Math.max.apply(Math, values));
                    return forEachCell(function (x, elem) {
                        return elem.css("background-color", "#" + colorFor(x));
                    });
                };
            })(this);
            switch (scope) {
                case "heatmap":
                    heatmapper(".pvtVal", "red");
                    break;
                case "rowheatmap":
                    for (i = _i = 0; 0 <= numRows ? _i < numRows : _i > numRows; i = 0 <= numRows ? ++_i : --_i) {
                        heatmapper(".pvtVal.row" + i, "red");
                    }
                    break;
                case "colheatmap":
                    for (j = _j = 0; 0 <= numCols ? _j < numCols : _j > numCols; j = 0 <= numCols ? ++_j : --_j) {
                        heatmapper(".pvtVal.col" + j, "red");
                    }
            }
            heatmapper(".pvtTotal.rowTotal", "red");
            heatmapper(".pvtTotal.colTotal", "red");
            return this;
        };

        /*
         Barchart post-processing
         */
        return $.fn.barchart = function () {
            var barcharter, i, numCols, numRows, _i;
            numRows = this.data("numrows");
            numCols = this.data("numcols");
            barcharter = (function (_this) {
                return function (scope) {
                    var forEachCell, max, scaler, values;
                    forEachCell = function (f) {
                        return _this.find(scope).each(function () {
                            var x;
                            x = $(this).data("value");
                            if ((x != null) && isFinite(x)) {
                                return f(x, $(this));
                            }
                        });
                    };
                    values = [];
                    forEachCell(function (x) {
                        return values.push(x);
                    });
                    max = Math.max.apply(Math, values);
                    scaler = function (x) {
                        return 100 * x / (1.4 * max);
                    };
                    return forEachCell(function (x, elem) {
                        var text, wrapper;
                        text = elem.text();
                        wrapper = $("<div>").css({
                            "position": "relative",
                            "height": "55px"
                        });
                        wrapper.append($("<div>").css({
                            "position": "absolute",
                            "bottom": 0,
                            "left": 0,
                            "right": 0,
                            "height": scaler(x) + "%",
                            "background-color": "gray"
                        }));
                        wrapper.append($("<div>").text(text).css({
                            "position": "relative",
                            "padding-left": "5px",
                            "padding-right": "5px"
                        }));
                        return elem.css({
                            "padding": 0,
                            "padding-top": "5px",
                            "text-align": "center"
                        }).html(wrapper);
                    });
                };
            })(this);
            for (i = _i = 0; 0 <= numRows ? _i < numRows : _i > numRows; i = 0 <= numRows ? ++_i : --_i) {
                barcharter(".pvtVal.row" + i);
            }
            barcharter(".pvtTotal.colTotal");
            return this;
        };
    });

}).call(this);

//# sourceMappingURL=pivot.js.map;
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var frFmt, frFmtInt, frFmtPct, nf, tpl;
    nf = $.pivotUtilities.numberFormat;
    tpl = $.pivotUtilities.aggregatorTemplates;
    frFmt = nf({
      thousandsSep: " ",
      decimalSep: ","
    });
    frFmtInt = nf({
      digitsAfterDecimal: 0,
      thousandsSep: " ",
      decimalSep: ","
    });
    frFmtPct = nf({
      digitsAfterDecimal: 1,
      scaler: 100,
      suffix: "%",
      thousandsSep: " ",
      decimalSep: ","
    });
    return $.pivotUtilities.locales.es = {
      localeStrings: {
        renderError: "Ocurri&oacute; un error durante la interpretaci&oacute;n de la tabla din&acute;mica.",
        computeError: "Ocurri&oacute; un error durante el c&acute;lculo de la tabla din&acute;mica.",
        uiRenderError: "Ocurri&oacute; un error durante el dibujado de la tabla din&acute;mica.",
        selectAll: "Seleccionar todo",
        selectNone: "Deseleccionar todo",
        tooMany: "(demasiados valores)",
        filterResults: "Filtrar resultados",
        totals: "Totales",
        vs: "vs",
        by: "por"
      },
      aggregators: {
        "Cuenta": tpl.count(frFmtInt),
        "Cuenta de valores &uacute;nicos": tpl.countUnique(frFmtInt),
        "Lista de valores &uacute;nicos": tpl.listUnique(", "),
        "Suma": tpl.sum(frFmt),
        "Suma de enteros": tpl.sum(frFmtInt),
        "Promedio": tpl.average(frFmt),
        "Suma de sumas": tpl.sumOverSum(frFmt),
        "Cota 80% superior": tpl.sumOverSumBound80(true, frFmt),
        "Cota 80% inferior": tpl.sumOverSumBound80(false, frFmt),
        "Proporci&oacute;n del total (suma)": tpl.fractionOf(tpl.sum(), "total", frFmtPct),
        "Proporci&oacute;n de la fila (suma)": tpl.fractionOf(tpl.sum(), "row", frFmtPct),
        "Proporci&oacute;n de la columna (suma)": tpl.fractionOf(tpl.sum(), "col", frFmtPct),
        "Proporci&oacute;n del total (cuenta)": tpl.fractionOf(tpl.count(), "total", frFmtPct),
        "Proporci&oacute;n de la fila (cuenta)": tpl.fractionOf(tpl.count(), "row", frFmtPct),
        "Proporci&oacute;n de la columna (cuenta)": tpl.fractionOf(tpl.count(), "col", frFmtPct)
      },
      renderers: {
        "Tabla": $.pivotUtilities.renderers["Table"],
        "Tabla con barras": $.pivotUtilities.renderers["Table Barchart"],
        "Heatmap": $.pivotUtilities.renderers["Heatmap"],
        "Heatmap por filas": $.pivotUtilities.renderers["Row Heatmap"],
        "Heatmap por columnas": $.pivotUtilities.renderers["Col Heatmap"]
      }
    };
  });



//# sourceMappingURL=pivot.es.js.map;
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var makeGoogleChart;
    makeGoogleChart = function(chartType, extraOptions) {
      return function(pivotData, opts) {
        var agg, colKey, colKeys, dataArray, dataTable, defaults, groupByTitle, h, hAxisTitle, headers, k, numCharsInHAxis, options, result, row, rowKey, rowKeys, title, v, vAxisTitle, wrapper, _i, _j, _len, _len1;
        defaults = {
          localeStrings: {
            vs: "vs",
            by: "by"
          }
        };
        opts = $.extend(defaults, opts);
        rowKeys = pivotData.getRowKeys();
        if (rowKeys.length === 0) {
          rowKeys.push([]);
        }
        colKeys = pivotData.getColKeys();
        if (colKeys.length === 0) {
          colKeys.push([]);
        }
        headers = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rowKeys.length; _i < _len; _i++) {
            h = rowKeys[_i];
            _results.push(h.join("-"));
          }
          return _results;
        })();
        headers.unshift("");
        numCharsInHAxis = 0;
        dataArray = [headers];
        for (_i = 0, _len = colKeys.length; _i < _len; _i++) {
          colKey = colKeys[_i];
          row = [colKey.join("-")];
          numCharsInHAxis += row[0].length;
          for (_j = 0, _len1 = rowKeys.length; _j < _len1; _j++) {
            rowKey = rowKeys[_j];
            agg = pivotData.getAggregator(rowKey, colKey);
            if (agg.value() != null) {
              row.push(agg.value());
            } else {
              row.push(null);
            }
          }
          dataArray.push(row);
        }
        title = vAxisTitle = pivotData.aggregatorName + (pivotData.valAttrs.length ? "(" + (pivotData.valAttrs.join(", ")) + ")" : "");
        hAxisTitle = pivotData.colAttrs.join("-");
        if (hAxisTitle !== "") {
          title += " " + opts.localeStrings.vs + " " + hAxisTitle;
        }
        groupByTitle = pivotData.rowAttrs.join("-");
        if (groupByTitle !== "") {
          title += " " + opts.localeStrings.by + " " + groupByTitle;
        }
        options = {
          width: $(window).width() / 1.4,
          height: $(window).height() / 1.4,
          title: title,
          hAxis: {
            title: hAxisTitle,
            slantedText: numCharsInHAxis > 50
          },
          vAxis: {
            title: vAxisTitle
          }
        };
        if (dataArray[0].length === 2 && dataArray[0][1] === "") {
          options.legend = {
            position: "none"
          };
        }
        for (k in extraOptions) {
          v = extraOptions[k];
          options[k] = v;
        }
        dataTable = google.visualization.arrayToDataTable(dataArray);
        result = $("<div style='width: 100%; height: 100%;'>");
        wrapper = new google.visualization.ChartWrapper({
          dataTable: dataTable,
          chartType: chartType,
          options: options
        });
        wrapper.draw(result[0]);
        result.bind("dblclick", function() {
          var editor;
          editor = new google.visualization.ChartEditor();
          google.visualization.events.addListener(editor, 'ok', function() {
            return editor.getChartWrapper().draw(result[0]);
          });
          return editor.openDialog(wrapper);
        });
        return result;
      };
    };
    return $.pivotUtilities.gchart_renderers = {
      "Line Chart": makeGoogleChart("LineChart"),
      "Bar Chart": makeGoogleChart("ColumnChart"),
      "Stacked Bar Chart": makeGoogleChart("ColumnChart", {
        isStacked: true
      }),
      "Area Chart": makeGoogleChart("AreaChart", {
        isStacked: true
      })
    };
  });



//# sourceMappingURL=gchart_renderers.js.map;
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    return $.pivotUtilities.d3_renderers = {
      Treemap: function(pivotData, opts) {
        var addToTree, color, defaults, height, margin, result, rowKey, tree, treemap, value, width, _i, _len, _ref;
        defaults = {
          localeStrings: {}
        };
        opts = $.extend(defaults, opts);
        result = $("<div style='width: 100%; height: 100%;'>");
        tree = {
          name: "All",
          children: []
        };
        addToTree = function(tree, path, value) {
          var child, newChild, x, _i, _len, _ref;
          if (path.length === 0) {
            tree.value = value;
            return;
          }
          if (tree.children == null) {
            tree.children = [];
          }
          x = path.shift();
          _ref = tree.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            if (!(child.name === x)) {
              continue;
            }
            addToTree(child, path, value);
            return;
          }
          newChild = {
            name: x
          };
          addToTree(newChild, path, value);
          return tree.children.push(newChild);
        };
        _ref = pivotData.getRowKeys();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rowKey = _ref[_i];
          value = pivotData.getAggregator(rowKey, []).value();
          if (value != null) {
            addToTree(tree, rowKey, value);
          }
        }
        color = d3.scale.category10();
        width = $(window).width() / 1.4;
        height = $(window).height() / 1.4;
        margin = 10;
        treemap = d3.layout.treemap().size([width, height]).sticky(true).value(function(d) {
          return d.size;
        });
        d3.select(result[0]).append("div").style("position", "relative").style("width", (width + margin * 2) + "px").style("height", (height + margin * 2) + "px").style("left", margin + "px").style("top", margin + "px").datum(tree).selectAll(".node").data(treemap.padding([15, 0, 0, 0]).value(function(d) {
          return d.value;
        }).nodes).enter().append("div").attr("class", "node").style("background", function(d) {
          if (d.children != null) {
            return "lightgrey";
          } else {
            return color(d.name);
          }
        }).text(function(d) {
          return d.name;
        }).call(function() {
          this.style("left", function(d) {
            return d.x + "px";
          }).style("top", function(d) {
            return d.y + "px";
          }).style("width", function(d) {
            return Math.max(0, d.dx - 1) + "px";
          }).style("height", function(d) {
            return Math.max(0, d.dy - 1) + "px";
          });
        });
        return result;
      }
    };
  });



//# sourceMappingURL=d3_renderers.js.map;
angular.module('ngTemplateTable')
    .directive('readMore', function() {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            template: '<p></p>',
            scope: {
                moreText: '@',
                lessText: '@',
                words: '@',
                ellipsis: '@',
                char: '@',
                limit: '@',
                content: '@'
            },
            link: function(scope, elem, attr, ctrl, transclude) {
                var moreText = angular.isUndefined(scope.moreText) ? ' <a class="read-more">Ver Mas...</a>' : ' <a class="read-more">' + scope.moreText + '</a>',
                    lessText = angular.isUndefined(scope.lessText) ? ' <a class="read-less">Ocultar ^</a>' : ' <a class="read-less">' + scope.lessText + '</a>',
                    ellipsis = angular.isUndefined(scope.ellipsis) ? '' : scope.ellipsis,
                    limit = angular.isUndefined(scope.limit) ? 150 : scope.limit;

                attr.$observe('content', function(str) {
                    readmore(str);
                });

                transclude(scope.$parent, function(clone, scope) {
                    readmore(clone.text().trim());
                });

                function readmore(text) {

                    var text = text,
                        orig = text,
                        regex = /\s+/gi,
                        charCount = text.length,
                        wordCount = text.trim().replace(regex, ' ').split(' ').length,
                        countBy = 'char',
                        count = charCount,
                        foundWords = [],
                        markup = text,
                        more = '';

                    if (!angular.isUndefined(attr.words)) {
                        countBy = 'words';
                        count = wordCount;
                    }

                    if (countBy === 'words') {

                        foundWords = text.split(/\s+/);

                        if (foundWords.length > limit) {
                            text = foundWords.slice(0, limit).join(' ') + ellipsis;
                            more = foundWords.slice(limit, count).join(' ');
                            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
                        }

                    } else {

                        if (count > limit) {
                            text = orig.slice(0, limit) + ellipsis;
                            more = orig.slice(limit, count);
                            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
                        }

                    }

                    elem.append(markup);
                    elem.find('.read-more').on('click', function() {
                        $(this).hide();
                        elem.find('.more-text').addClass('show').slideDown();
                    });
                    elem.find('.read-less').on('click', function() {
                        elem.find('.read-more').show();
                        elem.find('.more-text').hide().removeClass('show');
                    });

                }
            }
        };
    });

;/**
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
;/**
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
;/*

This datetimepicker is a simple angular wrapper of bootstrap datetimepicker(https://github.com/smalot/bootstrap-datetimepicker), which is the best I could found so far. 
It depends on the following stuffs:
1. bootstrap.css 2 or 3 
2. bootstrap-datetimepicker.css
3. jquery.js
4. bootstrap.js
5. bootstrap-datetimepicker.js
6. angular.js

Sample:
	<datetimepicker ng-model='date' today-btn='true' minute-step='30' ></datetimepicker>

Ron Liu
5/2/2014

*/

angular.module('ngTemplateTable')

.directive('datetimepicker', function () {
	function _byDefault(value, defaultValue) {
		return _isSet(value) ? value : defaultValue;
		function _isSet(value) {
			return !(value === null || value === undefined || value === NaN || value === '');
		}
	}

	return {
		restrict: 'AE',
		replace: true,
		scope: {
			ngModel: '=',
			format: '@',
			todayBtn: '@',
			weekStart: '@',
			minuteStep: '@'
		},
		template:
			'<div class="input-append date form_datetime">' +
	        '   <input size="16" type="text" value="" readonly>' +
	        '   <span class="add-on"><i class="icon-remove"></i></span>' +
			'	<span class="add-on"><i class="icon-th"></i></span>' +
	        '</div>',

		link: function (scope, element, attrs) {
			var $element = $(element.children()[0]);

			$element.datetimepicker({
				format: _byDefault(scope.format, 'd-m-yyyy'),
				weekStart: _byDefault(scope.weekStart, '1'),
				todayBtn: _byDefault(scope.todayBtn, 'true') === 'true',
				minuteStep: parseInt(_byDefault(scope.minuteStep, '5')),
				autoclose: 1,
				todayHighlight: 1,
				minView: 2,
				language: 'es',
				startView: 'decade',
				autoclose: true
			})
        	.on('changeDate', function (ev) {
        		scope.$apply(function() {
        			scope.ngModel = ev.date;
        		});
        	});

			scope.$watch('ngModel', function (newValue, oldValue) {
				$element.datetimepicker('update', newValue);
			});
		}
	};
});;/**
 * @ngdoc directive
 * @name ngTemplateTable.directive:popover
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */




;/**
 * Enhanced Select2 Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module('ui.select2', []).value('uiSelect2Config', {}).directive('uiSelect2', ['uiSelect2Config', '$timeout', function (uiSelect2Config, $timeout) {
  var options = {};
  if (uiSelect2Config) {
    angular.extend(options, uiSelect2Config);
  }
  return {
    require: 'ngModel',

    compile: function (tElm, tAttrs) {
      tElm=$(tElm);
      var watch,
        repeatOption,
        repeatAttr,
        isSelect = tElm.is('select'),
        isMultiple = angular.isDefined(tAttrs.multiple);

      // Enable watching of the options dataset if in use
      if (tElm.is('select')) {
        repeatOption = tElm.find('option[ng-repeat], option[data-ng-repeat]');

        if (repeatOption.length) {
          repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
          watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
        }
      }

      return function (scope, elm, attrs, controller) {
        elm=$(elm)
        // instance-specific options
        var opts = angular.extend({}, options, scope.$eval(attrs.uiSelect2));

        /*
        Convert from Select2 view-model to Angular view-model.
        */
        var convertToAngularModel = function(select2_data) {
          var model;
          if (opts.simple_tags) {
            model = [];
            angular.forEach(select2_data, function(value, index) {
              model.push(value.id);
            });
          } else {
            model = select2_data;
          }
          return model;
        };

        /*
        Convert from Angular view-model to Select2 view-model.
        */
        var convertToSelect2Model = function(angular_data) {
          var model = [];
          if (!angular_data) {
            return model;
          }

          if (opts.simple_tags) {
            model = [];
            angular.forEach(
              angular_data,
              function(value, index) {
                model.push({'id': value, 'text': value});
              });
          } else {
            model = angular_data;
          }
          return model;
        };

        if (isSelect) {
          // Use <select multiple> instead
          delete opts.multiple;
          delete opts.initSelection;
        } else if (isMultiple) {
          opts.multiple = true;
        }

        if (controller) {
          // Watch the model for programmatic changes
           scope.$watch(tAttrs.ngModel, function(current, old) {
            if (!current) {
              return;
            }
            if (current === old) {
              return;
            }
            controller.$render();
          }, true);
          controller.$render = function () {
            if (isSelect) {
              elm.select2('val', controller.$viewValue);
            } else {
              if (opts.multiple) {
                var viewValue = controller.$viewValue;
                if (angular.isString(viewValue)) {
                  viewValue = viewValue.split(',');
                }
                elm.select2(
                  'data', convertToSelect2Model(viewValue));
              } else {
                if (angular.isObject(controller.$viewValue)) {
                  elm.select2('data', controller.$viewValue);
                } else if (!controller.$viewValue) {
                  elm.select2('data', null);
                } else {
                  elm.select2('val', controller.$viewValue);
                }
              }
            }
          };

          // Watch the options dataset for changes
          if (watch) {
            scope.$watch(watch, function (newVal, oldVal, scope) {
              if (angular.equals(newVal, oldVal)) {
                return;
              }
              // Delayed so that the options have time to be rendered
              $timeout(function () {
                elm.select2('val', controller.$viewValue);
                // Refresh angular to remove the superfluous option
                elm.trigger('change');
                if(newVal && !oldVal && controller.$setPristine) {
                  controller.$setPristine(true);
                }
              });
            });
          }

          // Update valid and dirty statuses
          controller.$parsers.push(function (value) {
            var div = elm.prev();
            div
              .toggleClass('ng-invalid', !controller.$valid)
              .toggleClass('ng-valid', controller.$valid)
              .toggleClass('ng-invalid-required', !controller.$valid)
              .toggleClass('ng-valid-required', controller.$valid)
              .toggleClass('ng-dirty', controller.$dirty)
              .toggleClass('ng-pristine', controller.$pristine);
            return value;
          });

          if (!isSelect) {
            // Set the view and model value and update the angular template manually for the ajax/multiple select2.
            elm.bind("change", function (e) {
              e.stopImmediatePropagation();
              
              if (scope.$$phase || scope.$root.$$phase) {
                return;
              }
              scope.$apply(function () {
                controller.$setViewValue(
                  convertToAngularModel(elm.select2('data')));
              });
            });

            if (opts.initSelection) {
              var initSelection = opts.initSelection;
              opts.initSelection = function (element, callback) {
                initSelection(element, function (value) {
                  controller.$setViewValue(convertToAngularModel(value));
                  callback(value);
                });
              };
            }
          }
        }

        elm.bind("$destroy", function() {
          elm.select2("destroy");
        });

        attrs.$observe('disabled', function (value) {
          elm.select2('enable', !value);
        });

        attrs.$observe('readonly', function (value) {
          elm.select2('readonly', !!value);
        });

        if (attrs.ngMultiple) {
          scope.$watch(attrs.ngMultiple, function(newVal) {
            attrs.$set('multiple', !!newVal);
            elm.select2(opts);
          });
        }

        // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
        $timeout(function () {
          elm.select2(opts);

          // Set initial value - I'm not sure about this but it seems to need to be there
          elm.val(controller.$viewValue);
          // important!
          controller.$render();

          // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
          if (!opts.initSelection && !isSelect) {
            controller.$setViewValue(
              convertToAngularModel(elm.select2('data'))
            );
          }
        });
      };
    }
  };
}]);
