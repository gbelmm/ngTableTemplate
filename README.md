## Angularjs Template Table

## Instalación desde Bower
    bower install --save ng-template-table

## Modo de uso
    <div ng-template-table></div>
    <ng-template-table></ng-template-table>
    
## Parametros
        icon-expand="glyphicon glyphicon-plus"
        icon-collapse="glyphicon glyphicon-minus"
        icon-leaf="glyphicon glyphicon-file"
        type="tipo"
        data="data"
        column="column"
        order="true"
        search="true"
        paginate="true"
        numperpage="5"
    
   
## Ejemplo    
    <div ng-template-table 
    icon-expand="glyphicon glyphicon-plus"
    icon-collapse="glyphicon glyphicon-minus"
    icon-leaf="glyphicon glyphicon-file"
    type="tipo"
    data="data"
    column="column"
    order="true"
    search="true"
    paginate="true"
    numperpage="5" 
    >
    </div>
    
    angular.module('demo', ['ngTemplateTable'])
        .controller('demoCtrl', function ($scope) {
            $scope.tipo='table';
            
            $scope.column=[
                {
                data: 'description',
                name: 'Descripción del Plan',
                filter: true,
                order: true,
                type: 'text',
                filterType: '',
                inTable: false, // visible o no en tabla y tree-table
                inFilter:false  // visible en filtro de plantillas
                }]
            })