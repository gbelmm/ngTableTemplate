'use strict';
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        ngtemplates: {
            app: {
                src: 'template/**.html',
                dest: 'src/template.js',
                options: {
                    url: function (url) {
                        return url.replace('template/', '');
                    },
                    htmlmin: {collapseWhitespace: true, collapseBooleanAttributes: true},
                    module: 'ngTemplateTable'
                }
            }
        },
        uglify: {
            app: {
                files: {
                    'dist/ngTemplateTable.min.js': ['dist/ngTemplateTable.js'
                    ]
                }
            }
        },
        cssmin: {
            app: {
                files: {
                    'dist/ngTemplateTable.min.css': ['src/css/style.css','src/css/treeGrid.css','src/pivot/pivot.css']
                }
            }
        },
        copy: {
            main: {
                src: 'src/css/img/*',
                dest: 'dist/img/',
                expand: true,
                flatten: true,
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/ngTemplateTable.js',
                    'src/btn-order-filterDirective.js',
                    'src/filter.js',
                    'src/pagination.js',
                    'src/template.js',
                    'src/treerowDirective.js',
                    'src/ngTypeHtmlDirective.js',
                    'src/ngTypeDirective.js',
                    'src/sparklineDirective.js',
                    'src/tree-grid-directive.js',
                    'src/pivotDirective.js',
                    'src/pivot/pivot.js',
                    'src/pivot/pivot.es.js',
                    'src/pivot/gchart_renderers.js',
                    'src/pivot/d3_renderers.js',
                    'src/readMoreDirective.js',
                    'src/ngTemplateSearchDirective.js',
                    'src/ngTemplateNumberPerPageDirective.js',
                    'src/datetimepicker.js',
                    'src/popoverDirective.js',
                    'src/select2.js'
                ],
                dest: 'dist/ngTemplateTable.js'
            }
        },
        watch: {
            app: {
                files: ['src/**.js','src/css/**.css','template/**.html','demo/demoCtrl.js','src/pivot/**.js',],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            }
        }

    });
    grunt.registerTask('default', [
        'ngtemplates:app','concat:dist','uglify:app', 'cssmin:app','copy:main','watch:app' ]);
    grunt.registerTask('min', [
        'ngtemplates:app','concat:dist','uglify:app', 'cssmin:app','copy:main' ]);
}