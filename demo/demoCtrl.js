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
                data: 'responsable',
                name: 'Responsable',
                inTable: true,
                inTree:true,
                type: 'text',
                class:' col-md-2'

            },{
                data: 'plan',
                name: 'Plan de Acción',
                inTable: true,
                type: 'text',
                class:' col-md-9'

            },

            {
                data: 'estado',
                name: 'Estado',
                inTable: true,
                type: 'text'

            } ,
            {
                data: 'inicio',
                name: 'Fecha Inicio',
                inTable: true,
                type: 'date',
                colType: 'date'

            },
            {
                data: 'termino',
                name: 'Fecha Termino',
                inTable: true,
                type: 'date',
                colType: 'date'

            },
            {
                data: 'progreso',
                name: 'Progreso',
                inTable: true,
                type: 'text',
                colType: 'percentage'

            },

            {
                data: 'semaforo',
                name: 'sem',
                inTable: true,
                filter: false,
                order: false,
                type: 'html',
                inTree:true,
                inTable:false

            }

        ];
        var datos =

            [


                {
                    id: '1',
                    parentId: '',
                    icon: 'icon-building',
                    name: 'Vantaz',                       incident: '6',
                    CDM:
                        '5',
                    CTP:
                        '1',
                    STP:
                        '0',
                },



                {
                    id: '2',
                    parentId: '1',
                    icon: 'icon-building',
                    name: 'Vantaz 1.1',                       incident: '5',
                    CDM:
                        '4',
                    CTP:
                        '1',
                    STP:
                        '0',
                },



                {
                    id: '5',
                    parentId: '2',
                    icon: 'icon-building',
                    name: 'Vantaz 1.1.1',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '6',
                    parentId: '2',
                    icon: 'icon-building',
                    name: 'Vantaz 1.1.2',                       incident: '1',
                    CDM:
                        '1',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '3',
                    parentId: '1',
                    icon: 'icon-building',
                    name: 'Vantaz 1.2',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '12',
                    parentId: '3',
                    icon: 'icon-building',
                    name: 'Vantaz 1.2.1',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '13',
                    parentId: '12',
                    icon: 'icon-building',
                    name: 'Vantaz 1.2.1.1',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '17',
                    parentId: '12',
                    icon: 'icon-building',
                    name: 'test',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '4',
                    parentId: '1',
                    icon: 'icon-building',
                    name: 'Vantaz 1.3',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '7',
                    parentId: '4',
                    icon: 'icon-building',
                    name: 'Vantaz 1.3.1',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '8',
                    parentId: '4',
                    icon: 'icon-building',
                    name: 'Vantaz 1.3.2',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '9',
                    parentId: '4',
                    icon: 'icon-building',
                    name: 'Vantaz 1.3.3',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '10',
                    parentId: '4',
                    icon: 'icon-building',
                    name: 'Vantaz 1.3.4',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },



                {
                    id: '11',
                    parentId: '4',
                    icon: 'icon-building',
                    name: 'Vantaz 1.3.5',                       incident: '0',
                    CDM:
                        '0',
                    CTP:
                        '0',
                    STP:
                        '0',
                },


            ]


        $scope.data = datos;




    });
