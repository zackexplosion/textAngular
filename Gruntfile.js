module.exports = function (grunt) {
	
	// load all grunt tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-istanbul-coverage');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-karma-coveralls');
	grunt.loadNpmTasks('grunt-conventional-changelog');
	
	grunt.registerTask('compile', ['concat', 'uglify']);
	grunt.registerTask('default', ['compile', 'test']);
	grunt.registerTask('test', ['clean', 'jshint', 'karma', 'coverage']);
	grunt.registerTask('travis-test', ['jshint', 'karma', 'coverage', 'coveralls']);
	
	var testConfig = function (configFile, customOptions) {
		var options = { configFile: configFile, keepalive: true };
		var travisOptions = process.env.TRAVIS && { browsers: ['PhantomJS'], reporters: ['dots','coverage'] };
		return grunt.util._.extend(options, customOptions, travisOptions);
	};
	
	// Project configuration.
	grunt.initConfig({
		changelog: {options: {dest: 'changelog.md'}},
		clean: ["coverage"],
		coverage: {
		  options: {
		  	thresholds: {
			  'statements': 100,
			  'branches': 100,
			  'lines': 100,
			  'functions': 100
			},
			dir: 'coverage'
		  }
		},
		coveralls: {
			options: {
				debug: true,
				coverage_dir: 'coverage',
				force: true
			}
		},
		karma: {
		  jquery: {
			options: testConfig('karma-jquery.conf.js')
		  },
		  jqlite: {
			options: testConfig('karma-jqlite.conf.js')
		  }
		},
		jshint: {
		  files: ['lib/*.js', 'src/textAngular.js', 'src/textAngularSetup.js', 'test/*.spec.js', 'test/taBind/*.spec.js'],// don't hint the textAngularSanitize as they will fail
		  options: {
			eqeqeq: true,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			sub: true,
			boss: true,
			eqnull: true,
			globals: {}
		  }
		},
		concat: {
			options: {
				banner: "/*\n@license textAngular\nAuthor : Austin Anderson\nLicense : 2013 MIT\nVersion 1.3.0-pre14\n\nSee README.md or https://github.com/fraywing/textAngular/wiki for requirements and use.\n*/\n\n(function(){ // encapsulate all variables so they don't become global vars\n\"Use Strict\";",
				footer: "})();"
			},
			dist: {
				src: ['lib/globals.js','lib/factories.js','lib/DOM.js','lib/validators.js','lib/taBind.js','lib/main.js'],
				dest: 'src/textAngular.js'
			}
		},
		uglify: {
			options: {
				mangle: true,
				compress: true,
				wrap: true,
				preserveComments: 'some'
			},
			my_target: {
				files: {
					'dist/textAngular-rangy.min.js': ['bower_components/rangy/rangy-core.js', 'bower_components/rangy/rangy-selectionsaverestore.js'],
					'dist/textAngular.min.js': ['src/textAngularSetup.js','src/textAngular.js'],
					'dist/textAngular-sanitize.min.js': ['src/textAngular-sanitize.js']
				}
			}
		},
		watch: {
			files: "lib/*.js",
			tasks: "concat"
		}
	});
};