"use strict";

var gulp = require('gulp'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	csso = require('gulp-csso'),
	rev = require('gulp-rev-append-all');

gulp.task('js', function() {
	gulp.src([
		'../app/src/js/lib.js',
		'../app/src/js/node_connection.js',
		'../app/src/js/entities/**/*.js',
		'../app/src/js/utils/**/*.js',
		'../app/src/js/modals/**/*.js',
		'../app/src/js/pages/**/*.js',
		'../app/src/js/application.js',
		'../app/src/js/init.js'
	]).pipe(resolveDependencies())
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('../dist/'));
	
	gulp.src([
		'../app/src/js/vendor/jquery/jquery.js',
		'../app/src/js/vendor/moment/moment-with-locales.min.js',
		'../app/src/js/vendor/moment/moment-timezone-with-data-2010-2020.min.js',
		'../app/src/js/vendor/select2v3/select2.min.js',
		'../app/src/js/vendor/select2v3/select2_locale_ru.js',
		'../app/src/js/vendor/**/*.js'
	])
		.pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('../dist/'));
});

gulp.task('css', function() {
	gulp.src([
		'../app/src/css/govnokod.css',
		'../app/src/css/main.css'
	])
		.pipe(sourcemaps.init())
		.pipe(concat('app.css'))
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('../dist/'));
	
	gulp.src(['../app/src/css/vendor/**/*.css'])
		.pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
		.pipe(concat('vendor.css'))
		.pipe(csso())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('../dist/'));
});

gulp.task('rev', ['css', 'js'], function() {
	gulp.src(['../calendar.php'])
		.pipe(rev())
		.pipe(gulp.dest('../'));
});

gulp.task('update', ['rev']);

gulp.task('watch', function() {
	gulp.watch('../app/src/**/*.{js,css}', ['update']);
});