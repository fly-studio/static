module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // define source files and their destinations
        uglify: {
           
            common: {
                options: {
                    banner: '/*! common <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
                    compress: true,
                    sourceMap: true,
                    ASCIIOnly:true
                },
                files: { 'js/common.js' : ['js/common/common.js','js/common/polyfill.js','js/common/query.js']},  // source files mask
                flatten: true,   // remove all unnecessary nesting
                
            }
            
        }
    });

// load plugins
grunt.loadNpmTasks('grunt-contrib-uglify');

// register at least this one task
grunt.registerTask('default', [ 'uglify' ]);


};