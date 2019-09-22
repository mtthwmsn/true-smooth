module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: 'src/**/*.js',
				dest: 'dist/true-smooth.js',
			}
		},
		uglify: {
			build: {
				src: ['dist/true-smooth.js'],
				dest: 'dist/true-smooth.min.js'
			}
		},
		watch: {
			js: {
				files: 'src/**/*.js',
				tasks: ['concat', 'uglify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('dev', [
		'concat',
		'uglify',
		'watch'
	]);
}
