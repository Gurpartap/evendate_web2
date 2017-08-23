"use strict";

var gulp = require('gulp'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	csso = require('gulp-csso'),
	rename = require('gulp-rename'),
	runSequence = require('run-sequence').use(gulp),
	
	templates_path = '../app/templates/',
	js_path = '../app/src/js/',
	css_path = '../app/src/css/',
	vendor_path = '../app/src/vendor/',
	dest_path = '../dist/orders_widget/',
	srcs = {
		templates: [
			templates_path + 'wrappers.html',
			templates_path + 'commons.html',
			templates_path + 'modals/auth.html',
			templates_path + 'modals/bitcoin.html',
			templates_path + 'pages/order.html',
			templates_path + 'pages/legal_entity_payment.html'
		],
		vendor_js: [
			vendor_path + 'moment/moment-with-locales.js',
			vendor_path + 'moment/moment-timezone-with-data-2012-2022.js',
			vendor_path + 'jquery/jquery.js',
			vendor_path + 'jquery.history/jquery.history.js',
			vendor_path + 'jquery.inputmask/jquery.inputmask.bundle.min.js',
			vendor_path + 'jquery.fileDownload/jquery.fileDownload.js',
			vendor_path + 'jquery.suggestions/jquery.suggestions.js',
			vendor_path + 'pace/pace.min.js',
			vendor_path + 'notify/notify.js',
			vendor_path + 'select2v3/select2.js',
			vendor_path + 'select2v3/select2_locale_ru.js'
		],
		app_js: [
			js_path + 'lib.js',
			
			js_path + 'server/*.js',
			
			js_path + 'entities/city/*.js',
			js_path + 'entities/category/*.js',
			js_path + 'entities/promocode/*.js',
			js_path + 'entities/registration_field/*.js',
			js_path + 'entities/event/Class.OneEvent.js',
			js_path + 'entities/event/Class.FavoredEventsCollection.js',
			js_path + 'entities/user/*.js',
			js_path + 'entities/organization/*.js',
			js_path + 'entities/order_extended/Class.OneExtendedOrder.js',
			
			js_path + 'utils/Class.QuantityInput.js',
			
			js_path + 'modals/Class.AuthModal.js',
			js_path + 'modals/Class.BitcoinModal.js',
			
			js_path + 'ui/Class.Builder.js',
			
			js_path + 'pages/order/*.js',
			js_path + 'pages/Class.NotFoundPage.js',
			
			js_path + 'widget.js',
			js_path + 'locales.js',
			js_path + 'widget_init.js'
		],
		vendor_css: [
			vendor_path + 'pace/pace.css',
			vendor_path + 'select2v3/select2.css',
			vendor_path + 'jquery.suggestions/jquery.suggestions.css'
		],
		app_css: [
			css_path + 'vars.css',
			css_path + 'typography.css',
			css_path + 'common.css',
			
			css_path + 'components/button.css',
			css_path + 'components/form_components/*.css',
			css_path + 'components/fields.css',
			css_path + 'components/link.css',
			css_path + 'components/loader.css',
			css_path + 'components/material.css',
			css_path + 'components/uk-notify.css',
			
			css_path + 'modals/main.css',
			css_path + 'modals/auth_modal.css',
			css_path + 'modals/bitcoin_modal.css',
			
			css_path + 'pages/main.css',
			css_path + 'pages/user_side/order.css',
			css_path + 'pages/user_side/legal_entity_payment.css',
			
			css_path + 'app/main.css',
			css_path + 'widget.css',
			
			css_path + 'responsivity.css',
		]
	};

gulp.task('js', function() {
	
	return gulp.src(srcs.vendor_js.concat(srcs.app_js))
	           .pipe(resolveDependencies())
	           .pipe(concat('widget.js'))
	           .pipe(gulp.dest(dest_path));
});

gulp.task('css', function() {
	
	return gulp.src(srcs.vendor_css.concat(srcs.app_css))
	           .pipe(resolveDependencies())
	           .pipe(concat('widget.css'))
	           .pipe(gulp.dest(dest_path));
});

gulp.task('tmpl', function() {
	
	return gulp.src(srcs.templates)
	           .pipe(concat('templates.html'))
	           .pipe(gulp.dest(dest_path));
});

gulp.task('minify_js', ['js'], function() {
	
	return gulp.src(dest_path + 'widget.js')
	           .pipe(uglify())
	           .pipe(rename({extname: '.min.js'}))
	           .pipe(gulp.dest(dest_path));
});

gulp.task('minify_css', ['css'], function() {
	
	return gulp.src(dest_path + 'widget.css')
	           .pipe(autoprefixer())
	           .pipe(csso())
	           .pipe(rename({extname: '.min.css'}))
	           .pipe(gulp.dest(dest_path));
});

gulp.task('build_dev', function(cb) {
	
	return runSequence(['css', 'js', 'tmpl'], cb);
});

gulp.task('watch', function() {
	
	return gulp.watch(srcs.vendor_js.concat(srcs.app_js, srcs.vendor_css, srcs.app_css, srcs.templates), ['build_dev']);
});

gulp.task('build', function(cb) {
	
	return runSequence(['minify_css', 'minify_js', 'tmpl'], cb);
});