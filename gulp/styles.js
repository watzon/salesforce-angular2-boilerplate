module.exports = function(gulp, config) {
	'use strict';

	const sourcemaps = require('gulp-sourcemaps'),
			sass = require('gulp-sass');

	gulp.task('sass:dev', () => {
		return gulp.src(['src/**/*.scss'])
			.pipe(sourcemaps.init())
	    .pipe(sass().on('error', sass.logError))
			.pipe(sourcemaps.write())
	    .pipe(gulp.dest('build'));
	});

	gulp.task('sass:prod', () => {
		return gulp.src(['src/**/*.scss'])
	    .pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
	    .pipe(gulp.dest('build'));
	});

	gulp.task('css:dev', () => {
		return gulp.src(['src/**/*.css'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('css:prod', () => {
		return gulp.src(['src/**/*.css'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('styles:dev', gulp.parallel('sass:dev', 'css:dev'));
	gulp.task('styles:prod', gulp.parallel('sass:prod', 'css:prod'));

	gulp.task('watch:styles', () => {
		gulp.watch('src/**/*.scss', gulp.series('sass:dev'));
		gulp.watch('src/**/*.css', gulp.series('css:dev'));
	});
}
