var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  nib = require('nib'),
  jeet = require('jeet'),
  watch = require('gulp-watch'),
  connect = require('gulp-connect'),
  clean = require('gulp-clean'),
  runSequence = require('run-sequence'),
  rupture = require('rupture'),
  jade = require('gulp-jade'),
  shell = require('gulp-shell');

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
  var YOUR_LOCALS = {};

  gulp.src(['./templates/**/*.jade', '!./templates/**/_*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('./'));
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
  gulp.watch(['templates/**/*.jade'], ['jade']);
  gulp.watch(['./**/*.html'], ['html']);
  gulp.watch(['./js/*.js'], ['js']);
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

gulp.task('build', function(callback){
  runSequence(
    'clean',
    'copy',
    callback);
});

gulp.task('default', [
  'stylus',
  'jade',
  'connect',
  'watch'
]);
