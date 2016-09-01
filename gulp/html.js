module.exports = function(gulp, config, server) {
	'use strict';

	const template = require('gulp-template'),
		rename = require('gulp-rename');

	let vfDevTemplate = {
		node_modules_directory: "/node_modules/",
		app_directory: "/",
		baseUrl: '/',
		local: true,
		controller: '',
		auth: JSON.stringify({
			username:    config.deploy.username,
			password:    config.deploy.password,
			login_url:   config.deploy.login_url,
			api_version: config.deploy.api_version
		})
	};
	let vfProdTemplate = {
		node_modules_directory: `{!URLFOR($Resource.${config.resources.node_module_resource_name})}/`,
		app_directory: `{!URLFOR($Resource.${config.resources.app_resource_name})}/`,
		baseUrl: '/apex/' + config.visualforce.page,
		local: false,
		controller: config.visualforce.controller
	};

	gulp.task('html:dev', () => {
		return gulp.src(['src/**/*.html', 'src/' + config.visualforce.template])
			.pipe(gulp.dest('build'));
	});

	gulp.task('html:prod', () => {
		return gulp.src(['src/**/*.html', 'src/' + config.visualforce.template])
			.pipe(gulp.dest('build'));
	});

	gulp.task('visualforce:dev', () => {
		return gulp.src('src/' + config.visualforce.template)
		.pipe(rename((path) => {
			path.basename = 'index';
			path.extname = '.html'
		}))
		.pipe(template(vfDevTemplate))
		.pipe(gulp.dest('build'));
	});

	gulp.task('visualforce:prod', () => {
		return gulp.src(`src/${config.visualforce.template}`)
		.pipe(rename((path) => {
			path.basename = config.visualforce.page;
			path.extname = '.page';
		}))
		.pipe(template(vfProdTemplate))
		.pipe(gulp.dest('build'));
	});

	gulp.task('watch:html', () => {
		gulp.watch('src/**/!(*.vf).html', gulp.series('html:dev'));
		gulp.watch('src/' + config.visualforce.template, gulp.series('visualforce:dev'));
	});
}
