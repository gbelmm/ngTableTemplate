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
        $scope.tipo = 'tree';
        $scope.currentPage = 10;
        $scope.rojo = Math.floor(Math.random() * 101);
        $scope.verde = Math.floor(Math.random() * 101);

        $scope.column = [
            {
                data: 'name',
                name: 'Incidentes',
                inTree: true,
                class: 'col-md-9',
                type: 'customhtml',
                customHTML: '<a data-original-title="Editar" href="{{ value.path.edit }}/{{ value.id }}" class="btn btn-action" title="">{{value.name}}</a>'
            },
            {
                data: 'potentialIncident',
                name: 'Incidentes Potenciales',
                inTree: true,
                colType: 'number'
            },
            {
                data: 'rootCause',
                name: 'Causas BÃ¡sicas',
                inTree: true,
                colType: 'number'
            },
            {
                data: 'potentialCause',
                name: 'Causas Inmediatas',
                inTree: true,
                colType: 'number'
            },
            {
                data: 'measure',
                name: 'Medidas',
                inTree: true,
                colType: 'number'
            }
        ];


        $scope.data =  [
            {
                id: '1',
                parentId: '',
                icon: 'fa fa-building-o',
                name: 'Vantaz',
                potentialIncident: '30',
                rootCause: '27',
                potentialCause: '42',
                measure: '22'
            },

            {
                id: '2',
                parentId: '1',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.1',
                potentialIncident: '10',
                rootCause: '0',
                potentialCause: '0',
                measure: '16'
            },

            {
                id: '5',
                parentId: '2',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.1.1',
                potentialIncident: '7',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '5P5',
                parentId: '5',
                icon: 'icon-cogs',
                name: 'Padre',
                potentialIncident: '7',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT44',
                parentId: '5P5',
                icon: 'icon-check',
                name: 'Uso de Oficinas Administrativas / Uso de herramientas manuales',
                potentialIncident: '6',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT44H1',
                parentId: '2A5A5PT44',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '6',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI6',
                parentId: '2A5A5PT44H1',
                icon: 'icon-lightbulb',
                name: 'Caidas de distinto nivel',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI5',
                parentId: '2A5A5PT44H1',
                icon: 'icon-lightbulb',
                name: 'Caidas',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI4',
                parentId: '2A5A5PT44H1',
                icon: 'icon-lightbulb',
                name: 'Caida a mismo nivel',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI3',
                parentId: '2A5A5PT44H1',
                icon: 'icon-lightbulb',
                name: 'Caída a diferente nivel',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI1',
                parentId: '2A5A5PT44H1',
                icon: 'icon-lightbulb',
                name: 'Atrapamiento',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI2',
                parentId: '2A5A5PT44H1',
                icon: 'icon-lightbulb',
                name: 'Atropello',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT41',
                parentId: '5P5',
                icon: 'icon-check',
                name: 'Uso de Oficinas Administrativas / Uso de elementos punzantes y/o cortantes',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT35',
                parentId: '5P5',
                icon: 'icon-check',
                name: 'Uso de Oficinas Administrativas / Calentamiento de Alimentos en Comedor',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT31',
                parentId: '5P5',
                icon: 'icon-check',
                name: 'Transito entre oficinas / Transito de personas al interior de oficinas',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT31H1',
                parentId: '2A5A5PT31',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI20',
                parentId: '2A5A5PT31H1',
                icon: 'icon-lightbulb',
                name: 'Golpes',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT23',
                parentId: '5P5',
                icon: 'icon-check',
                name: 'Decomiso equipos telefonicos / Almacenamiento transitorio',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2A5A5PT21',
                parentId: '5P5',
                icon: 'icon-check',
                name: 'Conducción y traslado de personal desde ciudad a instalaciones Mina / Traslado en radio taxi',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '6',
                parentId: '2',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.1.2',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2P5',
                parentId: '2',
                icon: 'icon-cogs',
                name: 'Padre',
                potentialIncident: '9',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1A2A5PT29',
                parentId: '2P5',
                icon: 'icon-check',
                name: 'Levantamiento de Informacion / Uso de Tablet',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1A2A5PT21',
                parentId: '2P5',
                icon: 'icon-check',
                name: 'Conducción y traslado de personal desde ciudad a instalaciones Mina / Traslado en radio taxi',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1A2A5PT21H1',
                parentId: '1A2A5PT21',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI2',
                parentId: '1A2A5PT21H1',
                icon: 'icon-lightbulb',
                name: 'Atropello',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI1',
                parentId: '1A2A5PT21H1',
                icon: 'icon-lightbulb',
                name: 'Atrapamiento',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2P2',
                parentId: '2',
                icon: 'icon-cogs',
                name: 'Traslados en Servicios de Consultoria y Asesorias para proyectos',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '16'
            },

            {
                id: '1A2A2PT20',
                parentId: '2P2',
                icon: 'icon-check',
                name: 'Conducción y traslado de personal desde ciudad a instalaciones Mina / Conduccion de vehiculo con un maximo de 03 personas mas conductor por vehiculo',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '16'
            },

            {
                id: '1A2A2PT20H7',
                parentId: '1A2A2PT20',
                icon: 'icon-warning-sign',
                name: 'Camioneta',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '16'
            },

            {
                id: '7PI6',
                parentId: '1A2A2PT20H7',
                icon: 'icon-lightbulb',
                name: 'Caidas de distinto nivel',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '16'
            },

            {
                id: '1A2A2PT20H1',
                parentId: '1A2A2PT20',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3',
                parentId: '1',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.2',
                potentialIncident: '5',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '12',
                parentId: '3',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.2.1',
                potentialIncident: '3',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '13',
                parentId: '12',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.2.1.1',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '17',
                parentId: '12',
                icon: 'fa fa-building-o',
                name: 'test',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '12P5',
                parentId: '12',
                icon: 'icon-cogs',
                name: 'Padre',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3A12A5PT21',
                parentId: '12P5',
                icon: 'icon-check',
                name: 'Conducción y traslado de personal desde ciudad a instalaciones Mina / Traslado en radio taxi',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3A12A5PT21H1',
                parentId: '3A12A5PT21',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI1',
                parentId: '3A12A5PT21H1',
                icon: 'icon-lightbulb',
                name: 'Atrapamiento',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '12P4',
                parentId: '12',
                icon: 'icon-cogs',
                name: 'Proyectos con trabajo en terreno',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3A12A4PT22',
                parentId: '12P4',
                icon: 'icon-check',
                name: 'Decomiso equipos telefonicos / Almacenamiento de residuos en area RESITER',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3A12A4PT22H1',
                parentId: '3A12A4PT22',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI2',
                parentId: '3A12A4PT22H1',
                icon: 'icon-lightbulb',
                name: 'Atropello',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI1',
                parentId: '3A12A4PT22H1',
                icon: 'icon-lightbulb',
                name: 'Atrapamiento',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '4',
                parentId: '1',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.3',
                potentialIncident: '9',
                rootCause: '0',
                potentialCause: '0',
                measure: '1'
            },

            {
                id: '3P4',
                parentId: '3',
                icon: 'icon-cogs',
                name: 'Proyectos con trabajo en terreno',
                potentialIncident: '4',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1A3A4PT24',
                parentId: '3P4',
                icon: 'icon-check',
                name: 'Decomiso equipos telefonicos / Carga y descarga de camioneta',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1A3A4PT24H1',
                parentId: '1A3A4PT24',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI3',
                parentId: '1A3A4PT24H1',
                icon: 'icon-lightbulb',
                name: 'Caída a diferente nivel',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI2',
                parentId: '1A3A4PT24H1',
                icon: 'icon-lightbulb',
                name: 'Atropello',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3P2',
                parentId: '3',
                icon: 'icon-cogs',
                name: 'Traslados en Servicios de Consultoria y Asesorias para proyectos',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1A3A2PT29',
                parentId: '3P2',
                icon: 'icon-check',
                name: 'Levantamiento de Informacion / Uso de Tablet',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3P1',
                parentId: '3',
                icon: 'icon-cogs',
                name: 'Servicios de Asesoria y Consultoria',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1A3A1PT22',
                parentId: '3P1',
                icon: 'icon-check',
                name: 'Decomiso equipos telefonicos / Almacenamiento de residuos en area RESITER',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '7',
                parentId: '4',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.3.1',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '8',
                parentId: '4',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.3.2',
                potentialIncident: '5',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '8P5',
                parentId: '8',
                icon: 'icon-cogs',
                name: 'Padre',
                potentialIncident: '5',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '4A8A5PT27',
                parentId: '8P5',
                icon: 'icon-check',
                name: 'Deploy equipos telefonicos / Retiro equipos bodega Me',
                potentialIncident: '5',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '4A8A5PT27H2',
                parentId: '4A8A5PT27',
                icon: 'icon-warning-sign',
                name: 'Caída',
                potentialIncident: '3',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2PI3',
                parentId: '4A8A5PT27H2',
                icon: 'icon-lightbulb',
                name: 'Caída a diferente nivel',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2PI2',
                parentId: '4A8A5PT27H2',
                icon: 'icon-lightbulb',
                name: 'Atropello',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2PI1',
                parentId: '4A8A5PT27H2',
                icon: 'icon-lightbulb',
                name: 'Atrapamiento',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '4A8A5PT27H1',
                parentId: '4A8A5PT27',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '2',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI20',
                parentId: '4A8A5PT27H1',
                icon: 'icon-lightbulb',
                name: 'Golpes',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1PI25',
                parentId: '4A8A5PT27H1',
                icon: 'icon-lightbulb',
                name: 'Incendio de Vehículo',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '9',
                parentId: '4',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.3.3',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '9P4',
                parentId: '9',
                icon: 'icon-cogs',
                name: 'Proyectos con trabajo en terreno',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '4A9A4PT44',
                parentId: '9P4',
                icon: 'icon-check',
                name: 'Uso de Oficinas Administrativas / Uso de herramientas manuales',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '10',
                parentId: '4',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.3.4',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '11',
                parentId: '4',
                icon: 'fa fa-building-o',
                name: 'Vantaz 1.3.5',
                potentialIncident: '4',
                rootCause: '0',
                potentialCause: '0',
                measure: '1'
            },

            {
                id: '4P5',
                parentId: '4',
                icon: 'icon-cogs',
                name: 'Padre',
                potentialIncident: '5',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '11P1',
                parentId: '11',
                icon: 'icon-cogs',
                name: 'Servicios de Asesoria y Consultoria',
                potentialIncident: '4',
                rootCause: '0',
                potentialCause: '0',
                measure: '1'
            },

            {
                id: '4A11A1PT20',
                parentId: '11P1',
                icon: 'icon-check',
                name: 'Conducción y traslado de personal desde ciudad a instalaciones Mina / Conduccion de vehiculo con un maximo de 03 personas mas conductor por vehiculo',
                potentialIncident: '4',
                rootCause: '0',
                potentialCause: '0',
                measure: '1'
            },

            {
                id: '4A11A1PT20H15',
                parentId: '4A11A1PT20',
                icon: 'icon-warning-sign',
                name: 'Golpeado por o contra',
                potentialIncident: '4',
                rootCause: '0',
                potentialCause: '0',
                measure: '1'
            },

            {
                id: '15PI25',
                parentId: '4A11A1PT20H15',
                icon: 'icon-lightbulb',
                name: 'Incendio de Vehículo',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '15PI17',
                parentId: '4A11A1PT20H15',
                icon: 'icon-lightbulb',
                name: 'Golpe electrico',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '15PI16',
                parentId: '4A11A1PT20H15',
                icon: 'icon-lightbulb',
                name: 'Electrocución',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '15PI11',
                parentId: '4A11A1PT20H15',
                icon: 'icon-lightbulb',
                name: 'Colision',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '1'
            },

            {
                id: '4A11A1PT20H8',
                parentId: '4A11A1PT20',
                icon: 'icon-warning-sign',
                name: 'Cartoneros / Tijeras / Corcheteras',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '1P1',
                parentId: '1',
                icon: 'icon-cogs',
                name: 'Servicios de Asesoria y Consultoria',
                potentialIncident: '10',
                rootCause: '27',
                potentialCause: '42',
                measure: '6'
            },

            {
                id: 'A1A1PT40',
                parentId: '1P1',
                icon: 'icon-check',
                name: 'Uso de Oficinas Administrativas / Uso de baños',
                potentialIncident: '5',
                rootCause: '27',
                potentialCause: '42',
                measure: '5'
            },

            {
                id: 'A1A1PT40H1',
                parentId: 'A1A1PT40',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: 'A1A1PT40H3',
                parentId: 'A1A1PT40',
                icon: 'icon-warning-sign',
                name: 'Caídas',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3PI1',
                parentId: 'A1A1PT40H3',
                icon: 'icon-lightbulb',
                name: 'Atrapamiento',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: 'A1A1PT40H14',
                parentId: 'A1A1PT40',
                icon: 'icon-warning-sign',
                name: 'Equipo Portatil,',
                potentialIncident: '1',
                rootCause: '23',
                potentialCause: '37',
                measure: '3'
            },

            {
                id: '14PI1',
                parentId: 'A1A1PT40H14',
                icon: 'icon-lightbulb',
                name: 'Atrapamiento',
                potentialIncident: '-',
                rootCause: '23',
                potentialCause: '37',
                measure: '3'
            },

            {
                id: 'A1A1PT40H2',
                parentId: 'A1A1PT40',
                icon: 'icon-warning-sign',
                name: 'Caída',
                potentialIncident: '3',
                rootCause: '4',
                potentialCause: '5',
                measure: '2'
            },

            {
                id: '2PI14',
                parentId: 'A1A1PT40H2',
                icon: 'icon-lightbulb',
                name: 'Contuciones',
                potentialIncident: '-',
                rootCause: '2',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '2PI9',
                parentId: 'A1A1PT40H2',
                icon: 'icon-lightbulb',
                name: 'Choque',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '1',
                measure: '0'
            },

            {
                id: '2PI4',
                parentId: 'A1A1PT40H2',
                icon: 'icon-lightbulb',
                name: 'Caida a mismo nivel',
                potentialIncident: '-',
                rootCause: '2',
                potentialCause: '4',
                measure: '2'
            },

            {
                id: 'A1A1PT34',
                parentId: '1P1',
                icon: 'icon-check',
                name: 'Uso de Oficinas Administrativas / Actividades diarias en sillas',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: 'A1A1PT20',
                parentId: '1P1',
                icon: 'icon-check',
                name: 'Conducción y traslado de personal desde ciudad a instalaciones Mina / Conduccion de vehiculo con un maximo de 03 personas mas conductor por vehiculo',
                potentialIncident: '5',
                rootCause: '0',
                potentialCause: '0',
                measure: '1'
            },

            {
                id: 'A1A1PT20H3',
                parentId: 'A1A1PT20',
                icon: 'icon-warning-sign',
                name: 'Caídas',
                potentialIncident: '1',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: '3PI2',
                parentId: 'A1A1PT20H3',
                icon: 'icon-lightbulb',
                name: 'Atropello',
                potentialIncident: '-',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: 'A1A1PT20H2',
                parentId: 'A1A1PT20',
                icon: 'icon-warning-sign',
                name: 'Caída',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

            {
                id: 'A1A1PT20H1',
                parentId: 'A1A1PT20',
                icon: 'icon-warning-sign',
                name: 'Bus de traslado',
                potentialIncident: '0',
                rootCause: '0',
                potentialCause: '0',
                measure: '0'
            },

        ];




    });
