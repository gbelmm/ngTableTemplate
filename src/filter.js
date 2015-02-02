/**
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
    }])