"use strict";

const gulp = require('gulp'),
	util = require('gulp-util'),
	resolveDependencies = require('gulp-resolve-dependencies'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	csso = require('gulp-csso'),
	rev = require('gulp-rev-append'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	console = require('console'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	cache = require('gulp-cached'),
	remember = require('gulp-remember'),
	gulpStreamToPromise = require('gulp-stream-to-promise'),
	
	js_path = '../app/src/js/',
	css_path = '../app/src/css/',
	vendor_path = '../app/src/vendor/',
	dest_path = '../dist/',
	srcs = {
		vendor_js: [
			vendor_path + 'jquery/jquery.js',
			vendor_path + 'jquery.dataTables/js/jquery.dataTables.js',
			vendor_path + 'jquery.dataTables/js/*.js',
			vendor_path + '**/*.js'
		],
		app_js: [
			js_path + 'lib.js',
			js_path + 'locales.js',
			js_path + 'connections/*.js',
			js_path + 'server/*.js',
			js_path + 'entities/*.js',
			js_path + 'data_models/**/*.js',
			js_path + 'entities/**/*.js',
			js_path + 'ui/**/*.js',
			js_path + 'utils/**/*.js',
			js_path + 'modals/**/*.js',
			js_path + 'pages/**/*.js',
			js_path + 'app_init.js'
		],
		vendor_css: [
			vendor_path + 'jquery.dataTables/css/jquery.dataTables.css',
			vendor_path + '**/*.css'
		],
		app_css: [
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

function build(is_prod, cb) {
	let css,
		js,
		tmpl;
	
	function minifyCSS(stream) {
		
		return stream
			.pipe(autoprefixer())
			.pipe(csso())
			.pipe(rename({extname: '.min.css'}))
			.pipe(gulp.dest(dest_path));
	}
	
	function swallowError(error) {
		util.log(error.message);
		this.emit('end')
	}
	
	css = new Promise((resolve, reject) => {
		const css_start = Date.now();
		
		Promise.all([
			/**
			 * Vendor css
			 */
			new Promise(r => {
				let stream,
					start = Date.now();
				
				stream = gulp.src(srcs.vendor_css)
				             .pipe(concat('vendor.css'))
				             .pipe(gulp.dest(dest_path));
				
				if (is_prod) {
					stream = minifyCSS(stream);
				}
				
				gulpStreamToPromise(stream).then(() => {
					util.log('vendor.css build finished', ((Date.now() - start) / 1000).toFixed(2), 's');
					r();
				});
			}),
			
			/**
			 * App css
			 */
			new Promise(r => {
				let stream,
					start = Date.now();
				
				stream = gulp.src(srcs.app_css)
				             .pipe(resolveDependencies())
				             .pipe(concat('app.css'))
				             .pipe(gulp.dest(dest_path));
				
				if (is_prod) {
					stream = minifyCSS(stream);
				}
				
				gulpStreamToPromise(stream).then(() => {
					util.log('app.css build finished', ((Date.now() - start) / 1000).toFixed(2), 's');
					r();
				});
			})
		]).catch(reject).then(() => {
			util.log('CSS files build finished', ((Date.now() - css_start) / 1000).toFixed(2), 's');
			resolve();
		});
	});
	
	js = new Promise((resolve, reject) => {
		const js_start = Date.now();
		
		Promise.all([
			/**
			 * Vendor js
			 */
			new Promise(r => {
				let stream,
					start = Date.now();
				
				stream = gulp.src(srcs.vendor_js)
				             .pipe(resolveDependencies())
				             .pipe(concat('vendor.js'))
				             .pipe(gulp.dest(dest_path));
				
				if (is_prod) {
					stream = stream
						.pipe(uglify().on('error', e => {
							reject(e);
						}))
						.pipe(rename({extname: '.min.js'}))
						.pipe(gulp.dest(dest_path));
				}
				
				gulpStreamToPromise(stream).then(() => {
					util.log('vendor.js build finished', ((Date.now() - start) / 1000).toFixed(2), 's');
					r();
				});
			}),
			
			/**
			 * App js
			 */
			new Promise(r => {
				let stream,
					start = Date.now();
				
				stream = gulp.src(srcs.app_js);
				
				if (!is_prod) {
					stream = stream
						.pipe(cache('scripts'))
						.pipe(resolveDependencies())
						.pipe(sourcemaps.init())
						.pipe(babel())
						.on('error', swallowError)
						.pipe(remember('scripts'))
						.pipe(concat('app.js'))
						.pipe(sourcemaps.write('.'));
				} else {
					stream = stream
						.pipe(resolveDependencies())
						.pipe(concat('app.js'))
						.pipe(babel())
						.pipe(gulp.dest(dest_path))
						.pipe(uglify().on('error', e => {
							reject(e);
						}))
						.pipe(rename({extname: '.min.js'}));
				}
				
				stream = stream.pipe(gulp.dest(dest_path));
				
				gulpStreamToPromise(stream).then(() => {
					util.log('app.js build finished', ((Date.now() - start) / 1000).toFixed(2), 's');
					r();
				});
			})
		]).catch(reject).then(() => {
			util.log('JS files build finished', ((Date.now() - js_start) / 1000).toFixed(2), 's');
			resolve();
		});
	});
	
	tmpl = new Promise(resolve => {
		let stream,
			start = Date.now();
		
		stream = gulp.src('../app/templates/**/*.html')
		             .pipe(concat('templates.html'))
		             .pipe(gulp.dest(dest_path));
		
		gulpStreamToPromise(stream).then(() => {
			util.log('Templates bundling finished', ((Date.now() - start) / 1000).toFixed(2), 's');
			resolve();
		});
	});
	
	return Promise.all([
		css,
		js,
		tmpl
	]).catch(e => {
		console.error(e);
		
		return cb();
	}).then(() => {
		
		(new Promise(resolve => {
			var stream;
			
			stream = gulp.src('../parts/{styles,scripts}.php')
			             .pipe(gulp.dest('../'))
			             .pipe(rev())
			             .pipe(gulp.dest('../parts/'));
			
			gulpStreamToPromise(stream).then(() => {
				
				return gulpStreamToPromise(gulp.src('../{styles,scripts}.php', {read: false})
				                               .pipe(clean({force: true}))
				                               .pipe(gulp.dest('../')));
			});
			
		})).then(cb);
	});
}

gulp.task('build_dev', function(cb) {
	
	return build(false, cb);
});

gulp.task('watch', function(cb) {
	var watcher = gulp.watch('../app/{src,templates}/**/*.{js,jsx,css,html}', ['build_dev']);
	
	watcher.on('change', function (event) {
		if (event.type === 'deleted') {
			delete cache.caches['scripts'][event.path];
			remember.forget('scripts', event.path);
		}
	});
	
	return watcher;
});

gulp.task('build', function(cb) {
	
	return build(true, cb);
});