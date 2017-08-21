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
	srcs = {
		vendor_js: [
			'../app/src/vendor/jquery/jquery.js',
			'../app/src/vendor/jquery.dataTables/js/jquery.dataTables.js',
			'../app/src/vendor/jquery.dataTables/js/*.js',
			'../app/src/vendor/**/*.js'
		],
		app_js: [
			'../app/src/js/lib.js',
			'../app/src/js/server/*.js',
			'../app/src/js/entities/*.js',
			'../app/src/js/data_models/**/*.js',
			'../app/src/js/entities/**/*.js',
			'../app/src/js/utils/**/*.js',
			'../app/src/js/modals/**/*.js',
			'../app/src/js/ui/**/*.js',
			'../app/src/js/pages/**/*.js',
			'../app/src/js/application.js',
			'../app/src/js/init.js'
		],
		vendor_css: [
			'../app/src/vendor/jquery.dataTables/css/jquery.dataTables.css',
			'../app/src/vendor/**/*.css'
		],
		app_css: [
			'../app/src/css/govnokod.css',
			'../app/src/css/main.css'
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