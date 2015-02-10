angular.module('ngTemplateTable').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('buttom-filter.html',
    "<div class=\"btn-group\" ng-repeat=\"btndata in data\" ng-show=\"btndata.sort\"><button type=\"button\" ng-click=\"ghOrder(btndata.id)\" class=\"btn btn-default\"><span style=\"float: left;margin-right: 5px;opacity: 0.2\" class=\"fa\" ng-class=\"{'fa-sort':ghfiltername!=btndata.id,'fa-sort-desc':ghfiltername==btndata.id && ghrev,'fa-sort-asc':ghfiltername==btndata.id && !ghrev}\">&nbsp;</span> {{btndata.name|capitalize}}</button> <button ns-popover ns-popover-template=\"popover-data.html\" ns-popover-trigger=\"click\" ns-popover-theme=\"ns-popover-list-theme\" class=\"btn btn-default\"><span class=\"caret\"></span></button></div>"
  );


  $templateCache.put('numberPerPage.html',
    "<select ui-select2 ng-show=\"  type!='tree'  && type!='pivot'\" ng-model=\"ghnumperpage\" ng-change=\"ghfilters()\"><option ng-repeat=\"d in ghnumberPerPage\">{{d}}</option></select>"
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
