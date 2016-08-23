module.exports = function(gulp, config, server) {
	'use strict';

	const template = require('gulp-template'),
		rename = require('gulp-rename');

	let vfDevTemplate = {
		node_modules_directory: "/node_modules/",
		app_directory: "/",
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
		local: false,
		controller: config.visualforce.controller_name
	};

	gulp.task('html:dev', () => {
		return gulp.src(['src/**/!(*.vf).html'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('html:prod', () => {
		return gulp.src(['src/**/!(*.vf).html'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('visualforce:dev', () => {
		return gulp.src(['src/**/*.vf.html'])
		.pipe(rename((path) => {
			if (path.basename.indexOf('vf') > -1) {
				path.basename = path.basename.replace('.vf', '');
			}
		}))
		.pipe(template(vfDevTemplate))
		.pipe(gulp.dest('build'));
	});

	gulp.task('visualforce:prod', () => {
		return gulp.src(`src/${config.visualforce.original_filename}`)
		.pipe(rename((path) => {
			if (path.basename.indexOf('vf') > -1) {
				path.basename = config.visualforce.rename_to;
				path.extname = '';
			}
		}))
		.pipe(template(vfProdTemplate))
		.pipe(gulp.dest('build'));
	});

	gulp.task('watch:html', () => {
		gulp.watch('src/**/!(*.vf).html', gulp.series('html:dev'));
		gulp.watch('src/**/*.vf.html', gulp.series('visualforce:dev'));
	});
}
