// Gulp – compile & minify files, run server, watch for changes
var gulp         = require('gulp'),
    browserify   = require('browserify'),             // bundle packages for client-side use
    source       = require('vinyl-source-stream'),    // convert to vinyl-backed stream
    buffer       = require('vinyl-buffer'),           // convert back to buffered for plugins that don't allow streaming
    babel        = require('gulp-babel'),             // transpile scripts to ES6
    uglify       = require('gulp-uglify'),            // minify scripts
    scss         = require('gulp-scss'),              // compile SCSS files to CSS
    autoprefixer = require('gulp-autoprefixer'),      // auto-prefix CSS
    cleanCSS     = require('gulp-clean-css'),         // minify styles
    rename       = require('gulp-rename'),            // rename files when saving to build
    pump         = require('pump');                   // error handling
    webserver    = require('gulp-webserver');


/*
  Compile Styles
*/
gulp.task('styles',function(cb) {
    pump([
        gulp.src('styles/app.scss'),
        scss(),
        autoprefixer(),
        gulp.dest('public/styles'),
        cleanCSS(),
        rename({ suffix: '.min' }),
        gulp.dest('public/styles')
    ],
    cb);
});

/*
  Concatenate JS
*/
gulp.task('scripts', function(cb) {
    var browserifySrc = browserify({
        entries: 'scripts/app.js',
        debug: true
    }).bundle()
    pump([
        browserifySrc,
        source('script.js'),
        gulp.dest('public/scripts'),
        buffer(),
        babel({ presets: ['env'] }),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest('public/scripts')
    ],
    cb);
});

/*
  Watch for Changes
*/
gulp.task('watch', function() {
    gulp.watch('scripts/*.js', ['scripts']);
    gulp.watch('styles/**/*.scss', ['styles']);
});

/*
  Webserver
*/
gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true
        }));
});

gulp.task('default', ['styles', 'scripts', 'watch', 'webserver']);
