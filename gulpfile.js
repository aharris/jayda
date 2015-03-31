var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  nib = require('nib'),
  jeet = require('jeet'),
  // watch = require('gulp-watch'),
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

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});


gulp.task('stylus', function () {
  gulp.src(['./styl/**/*.styl', '!styl/**/_*'])
    .pipe(stylus({use: [nib(), jeet(), rupture()]}))
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload());
});

gulp.task('stylint', shell.task([
  'stylint ./styl/ -c .stylintrc'
]));

gulp.task('jade', function() {
  gulp.src(['./templates/**/*.jade', '!./templates/**/_*.jade'])
    .pipe(jadeGlobbing())
    .pipe(data(function() {
      return require('./jayda/data/' + 'tree' + '.json');
    }))
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('./'));

  gulp.src(['./jayda/templates/**/*.jade', '!./jayda/templates/**/_*.jade'])
    .pipe(jadeGlobbing())
    .pipe(data(function() {
      return require('./jayda/data/' + 'tree' + '.json');
    }))
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('./jayda'));

});

gulp.task('templatizer', function() {
    templatizer('./patterns/**/*.jade', './jayda/data/compiled_patterns.js', {
      namespace: 'J',
      dontremoveMixins: true
    });
});

gulp.task('html', function () {
  gulp.src('**/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./js/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['styl/**/*.styl'], ['stylus', 'stylint']);
  gulp.watch(['**/*.jade'], ['jade']);
  gulp.watch(['patterns/**/*.jade'], ['tree', 'templatizer']);
  // gulp.watch(['./**/*.html'], ['html']);
  gulp.watch(['./js/*.js', './jayda/js/*.js'], ['js']);
});

gulp.task('tree', function () {
  return gulp.src('patterns/**/*.jade')
    .pipe(directoryMap({
      filename: 'tree.json',
      prefix: 'patterns'
    }))
    .pipe(gulp.dest('jayda/data/'));
});

gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});

gulp.task('clean', function () {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('copy', function() {
  gulp.src('css/**/*')
    .pipe(gulp.dest('build/css'));

  gulp.src('images/**/*')
    .pipe(gulp.dest('build/images'));

  gulp.src('js/**/*')
    .pipe(gulp.dest('build/js'));

  gulp.src('bower_components/**/*')
    .pipe(gulp.dest('build/bower_components'));

  gulp.src('fonts/**/*')
    .pipe(gulp.dest('build/fonts'));

  gulp.src('./*.html')
    .pipe(gulp.dest('build/'));
});

// Need to update build task
// gulp.task('build', function(callback){
//   runSequence(
//     'clean',
//     'tree',
//     'copy',
//     callback);
// });

gulp.task('default', function(callback){
  runSequence(
    'tree',
    [
      'stylus',
      'jade',
      'templatizer'
    ],
    [
      'test',
      'connect',
      'watch'
    ],
    callback);
});
