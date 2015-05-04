var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  nib = require('nib'),
  jeet = require('jeet'),
  connect = require('gulp-connect'),
  clean = require('gulp-clean'),
  runSequence = require('run-sequence'),
  rupture = require('rupture'),
  jade = require('gulp-jade'),
  jadeGlobbing  = require('gulp-jade-globbing'),
  shell = require('gulp-shell'),
  gutil = require('gulp-util'),
  directoryMap = require("gulp-directory-map"),
  data = require('gulp-data'),
  templatizer = require('templatizer'),
  karma = require('karma').server;

// --------------------------------------
// App ----------------------------------
// --------------------------------------

gulp.task('stylus', function () {
  gulp.src(['./app/styl/**/*.styl', '!app/styl/**/_*'])
    .pipe(stylus({use: [nib(), jeet(), rupture()]}))
    .pipe(gulp.dest('./dest/css'))
    .pipe(connect.reload());
});

// Use gulp-stylint
// gulp.task('stylint', shell.task([
//   'stylint ./styl/ -c .stylintrc'
// ]));

gulp.task('jade', function() {
  gulp.src(['./app/templates/**/*.jade', '!./app/templates/**/_*.jade'])
    .pipe(jadeGlobbing())
    .pipe(data(function() {
      return require('./dest/jayda/data/' + 'tree' + '.json');
    }))
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('dest'))
    .pipe(connect.reload());
});

// gulp.task('js', function () {
//   gulp.src('app/js/**/*.js')
//     .pipe(gulp.dest('dest/js'));
// });

gulp.task('js', function () {
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
    .pipe(source('app.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dest/js/'))
    .pipe(connect.reload());

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(['./app/js/**/*.js', './app/components/**/*.js'], function(err, entries) {
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

gulp.task('tree', function () {
  return gulp.src('app/components/**/*.jade')
    .pipe(directoryMap({
      filename: 'tree.json',
      prefix: 'components'
    }))
    .pipe(gulp.dest('dest/jayda/data/'));
});

gulp.task('clean', function () {
  return gulp.src('dest', {read: false})
    .pipe(clean());
});

gulp.task('libs', function() {
  gulp.src('bower_components/**/*')
    .pipe(gulp.dest('dest/bower_components'));
});

// --------------------------------------
// JAYDA --------------------------------
// --------------------------------------

gulp.task('jayda-jade', function () {
  gulp.src(['./jayda/templates/**/*.jade', '!./jayda/templates/**/_*.jade'])
    .pipe(jadeGlobbing())
    .pipe(data(function() {
      return require('./dest/jayda/data/' + 'tree' + '.json');
    }))
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dest/jayda'))
    .pipe(connect.reload());
});

gulp.task('jayda-js', function () {
  gulp.src('jayda/js/**/*.js')
    .pipe(gulp.dest('dest/jayda/js'));
});

// --------------------------------------
// Tests --------------------------------
// --------------------------------------

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

// --------------------------------------
// Global -------------------------------
// --------------------------------------

gulp.task('mkdirs', shell.task([
  'mkdir ./dest && mkdir ./dest/jayda && mkdir ./dest/jayda/data'
]));

gulp.task('templatizer', function() {
    templatizer('./app/components/**/*.jade', './dest/jayda/data/compiled_patterns.js', {
      namespace: 'J',
      dontremoveMixins: true
    });
});

gulp.task('connect', function() {
  connect.server({
    root: ['dest'],
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['app/styl/**/*.styl', 'app/components/**/*.styl'], ['stylus']);
  gulp.watch(['./app/**/*.jade'], ['jade']);
  gulp.watch(['app/components/**/*.jade'], ['tree', 'templatizer']);
  gulp.watch(['app/js/**/*.js', 'app/components/**/*.js'], ['js']);

  // Jayda
  gulp.watch(['jayda/**/*'], ['jayda-jade']);
  gulp.watch(['jayda/js/**/*.js'], ['js']);
});

// --------------------------------------
// Commands -----------------------------
// --------------------------------------

gulp.task('default', function(callback){
  runSequence(
    [
    'clean'
    ],
    [
      'mkdirs'
    ],
    'libs',
    'js',
    'jayda-js',
    [
    'tree'
    ],
    [
      'stylus',
      'jade',
      'jayda-jade'
    ],
    [
      'templatizer'
    ],
    [
      'connect',
      'watch'
    ],
    callback);
});
