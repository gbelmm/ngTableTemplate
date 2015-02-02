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

        var datos = [{

            "plan": "Plan Creacion Garita",
            "descripcion": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos  Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la impre",
            "area": "Vantaz 1.1.1",
            "proyecto": "Gesti\u00f3n HSEC Vantaz",
            "contrato": "Gesti\u00f3n HSEC",
            "responsable": "Eduardo Chand\u00eda",
            "estado": "Ejecucci\u00f3n",
            "inicio": null,
            "termino": null,
            "progreso": "0 %",
            "alcance": "H S E",
            "semaforo": null,
            'parentId': null,
            id: 1
        }, {
            "plan": "Plan Mantenimiento",
            "descripcion": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos  Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la impre",
            "area": "Vantaz 1.3",
            "proyecto": "Gesti\u00f3n HSEC Vantaz",
            "contrato": "Gesti\u00f3n HSEC",
            "responsable": "German Rodriguez",
            "estado": "Registrado",
            "inicio": "04-01-2015",
            "termino": "13-01-2015",
            "progreso": "50 %",
            "alcance": "H S E C",
            "semaforo": "#bd362f",
            'parentId': null,
            id: 2
        }, {
            "plan": "asd",
            "descripcion": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos  Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la impre",
            "area": "Vantaz 1.1.1",
            "proyecto": "Gesti\u00f3n HSEC Vantaz",
            "contrato": "Gesti\u00f3n HSEC",
            "responsable": "Claudio Lemus",
            "estado": "Creaci\u00f3n",
            "inicio": null,
            "termino": null,
            "progreso": "0 %",
            "alcance": "H",
            "semaforo": null,
            'parentId': 5,
            id: 3
        }, {

            "plan": "plan 3",
            "descripcion": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos  Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la impre",
            "area": "Vantaz",
            "proyecto": "Gesti\u00f3n HSEC Vantaz",
            "contrato": "Gesti\u00f3n HSEC",
            "responsable": "GABRIEL MU\u00d1OZ",
            "estado": "Creaci\u00f3n",
            "inicio": "04-01-2015",
            "termino": "15-01-2015",
            "progreso": "25 %",
            "alcance": "H",
            "semaforo": "#bd362f",
            'parentId': 2,
            id: 4
        }, {

            "plan": "plan depasd",
            "descripcion": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos  Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la impre",
            "area": "Vantaz",
            "proyecto": "Gesti\u00f3n HSEC Vantaz",
            "contrato": "Gesti\u00f3n HSEC",
            "responsable": "Sim\u00f3n Sagredo",
            "estado": "Creaci\u00f3n",
            "inicio": "2014-06-17 12:33:26",
            "termino": "16-07-2015",
            "progreso": "0 %",
            "alcance": " S",
            "semaforo": "#51a351",
            'parentId': 4,
            id: 5
        }]
        $scope.data = datos;




    });
