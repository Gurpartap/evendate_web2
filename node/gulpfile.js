"use strict";

var gulp = require('gulp'),
	merge = require('merge-stream'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	csso = require('gulp-csso'),
	rev = require('gulp-rev-append'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	runSequence = require('run-sequence').use(gulp),
	js_path = '../app/src/js/',
	css_path = '../app/src/css/',
	vendor_path = '../app/src/vendor/',
	srcs = {
		vendor_js: [
			vendor_path + 'jquery/jquery.js',
			vendor_path + 'jquery.dataTables/js/jquery.dataTables.js',
			vendor_path + 'jquery.dataTables/js/*.js',
			vendor_path + '**/*.js'
		],
		app_js: [
			js_path + 'lib.js',
			js_path + 'server/*.js',
			js_path + 'entities/*.js',
			js_path + 'data_models/**/*.js',
			js_path + 'entities/**/*.js',
			js_path + 'utils/**/*.js',
			js_path + 'modals/**/*.js',
			js_path + 'ui/**/*.js',
			js_path + 'pages/**/*.js',
			js_path + 'application.js',
			js_path + 'init.js'
		],
		vendor_css: [
			vendor_path + 'jquery.dataTables/css/jquery.dataTables.css',
			vendor_path + '**/*.css'
		],
		app_css: [
			css_path + 'govnokod.css',
			
			css_path + 'vars.css',
			css_path + 'typography.css',
			css_path + 'common.css',
			css_path + 'components/**/*.css',
			
			css_path + 'app_inspector/main.css',
			css_path + 'app_inspector/**/*.css',
			
			css_path + 'modals/main.css',
			css_path + 'modals/**/*.css',
			
			css_path + 'pages/main.css',
			css_path + 'pages/**/*.css',
			
			css_path + 'app/main.css',
			css_path + 'app/header.css',
			css_path + 'app/sidebar.css',
			css_path + 'app/**/*.css',
			
			css_path + 'responsivity.css',
			css_path + 'print.css',
		]
	};

gulp.task('js', function() {
	
	return merge(
		gulp.src(srcs.vendor_js)
		    .pipe(resolveDependencies())
		    .pipe(concat('vendor.js'))
		    .pipe(gulp.dest('../dist/')),
		
		gulp.src(srcs.app_js)
		    .pipe(resolveDependencies())
		    .pipe(concat('app.js'))
		    .pipe(gulp.dest('../dist/'))
	);
});

gulp.task('css', function() {
	
	return merge(
		gulp.src(srcs.vendor_css)
		    .pipe(concat('vendor.css'))
		    .pipe(gulp.dest('../dist/')),
		
		gulp.src(srcs.app_css)
		    .pipe(resolveDependencies())
		    .pipe(concat('app.css'))
		    .pipe(gulp.dest('../dist/'))
	);
});

gulp.task('tmpl', function() {
	
	return gulp.src('../app/templates/**/*.html')
	           .pipe(concat('templates.html'))
	           .pipe(gulp.dest('../dist/'));
});

gulp.task('minify_js', ['js'], function() {
	
	return gulp.src('../dist/{app,vendor}.js')
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest('../dist/'));
});

gulp.task('minify_css', ['css'], function() {
	
	return gulp.src('../dist/{app,vendor}.css')
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(rename({extname: '.min.css'}))
		.pipe(gulp.dest('../dist/'));
});

gulp.task('rev_append', function() {
	
	return gulp.src('../parts/{styles,scripts}.php')
	           .pipe(gulp.dest('../'))
	           .pipe(rev())
	           .pipe(gulp.dest('../parts/'));
});

gulp.task('rev_clean', ['rev_append'], function() {
	
	return gulp.src('../{styles,scripts}.php', {read: false})
	           .pipe(clean({force: true}))
	           .pipe(gulp.dest('../'));
});

gulp.task('rev', ['rev_append', 'rev_clean']);

gulp.task('build_dev', function(cb) {
	
	return runSequence(['css', 'js', 'tmpl'], 'rev', cb);
});

gulp.task('watch', function() {
	
	return gulp.watch('../app/{src,templates}/**/*.{js,css,html}', ['build_dev']);
});

gulp.task('build', function(cb) {
	
	return runSequence(['minify_css', 'minify_js'], 'rev', cb);
});