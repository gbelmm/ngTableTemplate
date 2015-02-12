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
                        if (i !== '$$hashKey' && i !== 'parentId' && i !== 'children' && i !== 'id' && i !== 'icon' ) {

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
