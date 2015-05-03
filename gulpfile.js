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
      return require('./jayda/data/' + 'tree' + '.json');
    }))
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('dest'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dest/js'));
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
      return require('./jayda/data/' + 'tree' + '.json');
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
  gulp.watch(['app/js/*.js'], ['js']);

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
