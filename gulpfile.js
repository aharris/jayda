var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  nib = require('nib'),
  jeet = require('jeet'),
  connect = require('gulp-connect'),
  runSequence = require('run-sequence'),
  rupture = require('rupture'),
  jade = require('gulp-jade'),
  jadeGlobbing  = require('gulp-jade-globbing'),
  gutil = require('gulp-util'),
  directoryMap = require("gulp-directory-map"),
  templatizer = require('templatizer'),
  p = require('./package.json');

// --------------------------------------
// App ----------------------------------
// --------------------------------------

gulp.task('tree', function () {
  return gulp.src(['../' + p.config.appSrc + '/components/**/*.jade', '../' + p.config.appSrc + '/components/**/*.html', '../' + p.config.appSrc + '/components/**/*.js', '../' + p.config.appSrc + '/components/**/*.json'])
    .pipe(directoryMap({
      filename: 'tree.json',
      prefix: 'components'
    }))
    .pipe(gulp.dest('../dest/jayda/data/'));
});

// --------------------------------------
// JAYDA --------------------------------
// --------------------------------------

gulp.task('jayda-jade', function () {
  gulp.src(['./templates/**/*.jade', '!./templates/**/_*.jade'])
    .pipe(jadeGlobbing())
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('../dest/jayda'))
    .pipe(connect.reload());
});

gulp.task('jayda-stylus', function () {
  gulp.src(['./styl/**/*.styl', !'../' + p.config.appSrc + '/styl/**/_*'])
    .pipe(stylus({use: [nib(), jeet(), rupture()]}))
    .pipe(gulp.dest('../dest/jayda/css'))
    .pipe(connect.reload());
});

gulp.task('jayda-stylint', function() {
  var stylint = require('gulp-stylint');
  return gulp.src([p.config.appSrc + './**/*.styl', '!./styl/lib**/*.styl', '!./node_modules/**/*.styl', '!./bower_components/**/*.styl'])
    .pipe(stylint({config: '.stylintrc'}));
});

gulp.task('jayda-js', function () {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var globby = require('globby');
  var through = require('through2');
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');
  var reactify = require('reactify');

  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
    .pipe(source('jayda.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('../dest/jayda/js/'))
    .pipe(connect.reload());

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby([
    './js/jayda.js',
    './js/utils.js',
    './js/router.js',
    './js/jayda_jade.js',
    './js/jayda_html.js',
    './js/jayda_icons.js',
    './js/jayda_search.js'
  ], function(err, entries) {
    // ensure any errors from globby are handled
    if (err) {
      bundledStream.emit('error', err);
      return;
    }

    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream);
  });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
});

gulp.task('jayda-lib', function () {
  // JS
  gulp.src([
    './js/lib/*.js',
    './bower_components/jquery-ui/jquery-ui.min.js'
  ])
    .pipe(gulp.dest('../dest/jayda/js/lib'));

});


gulp.task('jayda-get-components', function () {
  gulp.src(['../' + p.config.appSrc + '/components/**/*.js', '../' + p.config.appSrc + '/components/**/*.json', '../' + p.config.appSrc + '/components/**/*.html'])
    .pipe(gulp.dest('../dest/components'));
});

gulp.task('jayda-templatizer', function() {
    templatizer('./components/**/*.jade', '../dest/jayda/js/compiled_patterns.js', {
      namespace: 'window.J.Jayda',
      dontremoveMixins: true
    });
});

gulp.task('jayda-images', function() {
  gulp.src('./images/**/*')
    .pipe(gulp.dest('../dest/images'));
});

gulp.task('jayda-font-icons', function() {
  return gulp.src(p.config.iconFontFile)
    .pipe(gulp.dest('../dest/jayda/data'))
    .pipe(connect.reload());
});

gulp.task('jayda-data', function() {
    return gulp.src('./data/**/*')
    .pipe(gulp.dest('../dest/jayda/data'));
});

gulp.task('watch', function() {
  gulp.watch(['./**/*.jade'], ['jayda-jade', 'jayda-templatizer']);
  gulp.watch(['./js/**/*.js'], ['jayda-js']);
  gulp.watch(['./styl/**/*.styl'], ['jayda-stylus', 'jayda-stylint']);
  gulp.watch(['./images/**/*'], ['jayda-images']);
  gulp.watch(['./data/icons.json'], ['jayda-font-icons']);
  gulp.watch(['./data/**/*'], ['jayda-data']);
});

// --------------------------------------
// Commands -----------------------------
// --------------------------------------

gulp.task('default', function(callback){
  runSequence(
    [
      'jayda-js',
      'jayda-lib',
      'jayda-get-components',
      'jayda-images',
    ],
    [
      'jayda-data',
      'tree'
    ],
    [
      'jayda-stylus',
      'jayda-stylint',
      'jayda-font-icons',
      'jayda-jade',
      'jayda-templatizer'
    ],
    callback);
});
