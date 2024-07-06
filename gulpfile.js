/**
 * NOTES
 * - If getting an error like: "Warning: Accessing non-existent property 'cat' of module exports inside circular dependency ... "
 * 		=> make sure all references to shelljs specify version ^0.8.4 and run `npm i shelljs`
 */

const gulp     = require('gulp'),
	browserify   = require('browserify'),                  // bundle packages for client-side use
	stream       = require('vinyl-source-stream'),         // convert to vinyl-backed stream
	buffer       = require('vinyl-buffer'),                // convert to buffered vinyl file object
	babel        = require('gulp-babel'),                  // transpile scripts to ES6
	uglify       = require('gulp-uglify'),                 // minify scripts
	stylelint    = require('gulp-stylelint'),              // lint SCSS
	scss         = require('gulp-sass')(require('sass')),  // compile SCSS files to CSS
	// autoprefixer = require('gulp-autoprefixer'),           // auto-prefix CSS
	cleanCSS     = require('gulp-clean-css'),              // minify styles
	rename       = require('gulp-rename');                 // rename files when saving to build


/*
	Error-Handling
*/
function streamError(error) {
	console.log(error.toString())
	this.emit('end')
}

function failOnError(error) {
	console.log(error.toString())
	process.exit(1)
}

/*
	Styles
*/
const styles = () => {
	return gulp.src(['styles/app.scss'], {base: './'})
		.pipe(scss())
		.on('error', streamError)
		.pipe(stylelint({ reporters: [{formatter: 'string', console: true }] }))
		// .pipe(autoprefixer())
		.pipe(rename({ basename: 'style' }))
		.pipe(gulp.dest('public'))
		.pipe(cleanCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public'))
}

/*
	Scripts
*/
const scripts = () => {
	return browserify({ entries: ['scripts/app.js'] })
		.transform('eslintify')
		.transform('babelify')
		.bundle()
		.on('error', streamError)
		.pipe(stream('scripts/app.js'))
		.pipe(rename({ basename: 'script' }))
		.pipe(gulp.dest('public'))
		.pipe(buffer())
		.pipe(babel())
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public'))
}

/*
	Watch for Changes
*/
const watch = () => {
	gulp.watch(['scripts/app.js'], scripts)
	gulp.watch(['styles/app.scss'], styles)
}

/***************************** Exported Tasks *****************************/
exports.default = gulp.series(gulp.parallel(styles, scripts), watch);
exports.build = gulp.series(gulp.parallel(styles, scripts));
/**************************************************************************/
