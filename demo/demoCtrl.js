/**
 * @ngdoc controller
 * @name demo.controller:demoCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


angular.module('demo', ['ngTemplateTable'])
    .controller('demoCtrl', function ($scope,$timeout) {
        $scope.tipo = 'table';
        $scope.currentPage = 10;
        $scope.rojo = Math.floor(Math.random() * 101);
        $scope.verde = Math.floor(Math.random() * 101);

        $scope.column = [
            {
                data: 'Name',
                name: 'Nombre',
                inTable: true,
                inTree:true,
                type: 'text',
                class:' col-md-2'

            },
            {
                data: 'Description',
                name: 'Descripción',
                inTable: true,
                inTree:true,
                type: 'text'

            },
            {data:'Area',inTable:true,inTree:true,colType:'number'}

        ];


        $scope.data = [
            {"id":1,"parentId":null,"Name":"United States of America","Description":"United States of America", "Area":9826675,"Population":318212000,"TimeZone":"UTC -5 to -10"},
            {"id":2,"parentId":1,"Name":"California","Description":"The Tech State","Area":423970,"Population":38340000,"TimeZone":"Pacific Time"},
            {"id":3,"parentId":2,"Name":"San Francisco","Description":"The happening city","Area":231,"Population":837442,"TimeZone":"PST"},
            {"id":4,"parentId":2,"Name":"Los Angeles","Description":"Disco city","Area":503,"Population":3904657,"TimeZone":"PST"},
            {"id":5,"parentId":1,"Name":"Illinois","Description":"Not so cool","Area":57914,"Population":12882135,"TimeZone":"Central Time Zone"},
            {"id":6,"parentId":5,"Name":"Chicago","Description":"Financial City","Area":234,"Population":2695598,"TimeZone":"CST"},
            {"id":7,"parentId":1,"Name":"Texas","Description":"Rances, Oil & Gas","Area":268581,"Population":26448193,"TimeZone":"Mountain"},
            {"id":8,"parentId":1,"Name":"New York","Description":"The largest diverse city","Area":141300,"Population":19651127,"TimeZone":"Eastern Time Zone"},
            {"id":14,"parentId":8,"Name":"Manhattan","Description":"Time Square is the place","Area":269.403,"Population":0,"TimeZone":"EST"},
            {"id":15,"parentId":14,"Name":"Manhattan City","Description":"Manhattan island","Area":33.77,"Population":0,"TimeZone":"EST"},
            {"id":16,"parentId":14,"Name":"Time Square","Description":"Time Square for new year","Area":269.40,"Population":0,"TimeZone":"EST"},
            {"id":17,"parentId":8,"Name":"Niagra water fall","Description":"Close to Canada","Area":65.7,"Population":0,"TimeZone":"EST"},
            {"id":18,"parentId":8,"Name":"Long Island","Description":"Harbour to Atlantic","Area":362.9,"Population":0,"TimeZone":"EST"},
            {"id":51,"parentId":1,"Name":"All_Other","Description":"All_Other demographics","Area":0,"Population":0,"TimeZone":0},
            {"id":201,"parentId":null,"Name":"India","Description":"Hydrabad tech city", "Area":9826675,"Population":318212000,"TimeZone":"IST"},
            {"id":301,"parentId":null,"Name":"Bangladesh","Description":"Country of love", "Area":9826675,"Population":318212000,"TimeZone":"BST"}
        ];




    });
