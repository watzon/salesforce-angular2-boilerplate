module.exports = function(gulp, config) {
	'use strict';

	const archiver = require('gulp-archiver'),
		rename = require('gulp-rename'),
		del = require('del'),
		pxml = require('./pxml'),
		file = require('gulp-file'),
		merge = require('merge-stream'),
		forceDeploy = require('gulp-jsforce-deploy');

	let pageMetaXml = `<?xml version="1.0" encoding="UTF-8"?>
<ApexPage xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>36.0</apiVersion>
    <label>{0}</label>
</ApexPage>`;

	let resourceMetaXml = `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Public</cacheControl>
    <contentType>application/octet-stream</contentType>
</StaticResource>`;

	gulp.task('clean-tmp', () => {
		return del(['.tmp']);
	});

	gulp.task('clean-build', () => {
		return del(['build']);
	});

	gulp.task('clean-resources', () => {
		return del(['.tmp/static_resources']);
	});

	gulp.task('init-deploy', gulp.series(
		'clean-tmp',
		'clean-build',
		gulp.parallel('html:prod', 'visualforce:prod', 'scripts:prod', 'styles:prod')
	));

	gulp.task('tempgen:visualforce', () => {
		return gulp.src(`build/${config.visualforce.rename_to}`)
			.pipe(gulp.dest('.tmp/pages'));
	});

	gulp.task('tempgen:node_modules', () => {
		return gulp.src([
			'node_modules/@angular/**/*',
			'node_modules/rxjs/**/*',
			'!node_modules/rxjs/src/**/*',
			'node_modules/jsforce/build/jsforce.min.js',
			'node_modules/core-js/client/shim.min.js',
			'node_modules/zone.js/dist/zone.js',
			'node_modules/reflect-metadata/Reflect.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/moment/moment.js',
			'!**/testing/**',
			'!**/testing.*',
			'!**/*.{md|txt|org|d.ts|js.map}'
		], { base: 'node_modules' })
			.pipe(gulp.dest(`.tmp/static_resources/${config.resources.node_module_resource_name}`));
	});

	gulp.task('tempgen:app', () => {
		return gulp.src(['build/**/*', `!build/${config.visualforce.rename_to}`])
			.pipe(gulp.dest(`.tmp/static_resources/${config.resources.app_resource_name}`));
	});

	gulp.task('tempgen:salesforce', () => {
		return gulp.src(['src/salesforce/**/*'])
			.pipe(gulp.dest('.tmp/'));
	});

	gulp.task('package:node_modules', () => {
		return gulp.src(`.tmp/static_resources/${config.resources.node_module_resource_name}/**/*`, {
			base: `.tmp/static_resources/${config.resources.node_module_resource_name}`
		})
			.pipe(archiver(`${config.resources.node_module_resource_name}.zip`))
			.pipe(rename({
				extname: '.resource'
			}))
			.pipe(gulp.dest('.tmp/staticresources'));
	});

	gulp.task('package:app', () => {
		return gulp.src(`.tmp/static_resources/${config.resources.app_resource_name}/**/*`, {
			base: `.tmp/static_resources/${config.resources.app_resource_name}`
		})
			.pipe(archiver(`${config.resources.app_resource_name}.zip`))
			.pipe(rename({
				extname: '.resource'
			}))
			.pipe(gulp.dest('.tmp/staticresources'));
	});

	gulp.task('tempgen:pxml', () => {
		return file('package.xml', pxml.from_dir('.tmp').generate().to_string(), { src: true })
			.pipe(gulp.dest('.tmp'));
	});

	gulp.task('tempgen:meta-xml', () => {
		let node_modules = file(`${config.resources.node_module_resource_name}.resource-meta.xml`,
				resourceMetaXml, { src: true })
			.pipe(gulp.dest('.tmp/staticresources'));

		let app = file(`${config.resources.app_resource_name}.resource-meta.xml`,
				resourceMetaXml, { src: true })
			.pipe(gulp.dest('.tmp/staticresources'));

		let page = file(`${config.visualforce.rename_to}-meta.xml`,
				pageMetaXml.replace("{0}", config.visualforce.rename_to.replace('.page', '')), { src: true })
			.pipe(gulp.dest('.tmp/pages'));

		return merge(node_modules, app, page);
	});

	gulp.task('package-resources', gulp.parallel('package:app', 'package:node_modules'));

	gulp.task('tempgen', gulp.series(
		'init-deploy',
		gulp.parallel('tempgen:node_modules', 'tempgen:app', 'tempgen:visualforce'),
		'package-resources',
		'clean-resources',
		'tempgen:salesforce',
		'tempgen:pxml',
		'tempgen:meta-xml',
		'clean-build'
	));

	gulp.task('deploy:jsforce', () => {
		return gulp.src('.tmp/**/*', { base: '.' })
		.pipe(archiver('pkg.zip'))
		.pipe(forceDeploy({
			username: config.deploy.username,
			password: config.deploy.password,
			loginUrl: config.deploy.login_url,
			version: config.deploy.api_version,
			checkOnly: process.env.CHECK_ONLY,
			pollTimeout: config.deploy.timeout,
			pollInterval: config.deploy.poll_interval
		}));
	});


	gulp.task('deploy', gulp.series('tempgen', 'deploy:jsforce'));
	gulp.task('deploy:classes', gulp.series('tempgen:salesforce', 'tempgen:pxml', 'deploy:jsforce'));

}
