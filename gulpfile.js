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
  karma = require('karma').server,
  p = require('./package.json');



// --------------------------------------
// App ----------------------------------
// --------------------------------------

// CSS ----------------------------------
// gulp.task('stylus', function () {
//   gulp.src([p.config.appSrc + '/styl/**/*.styl', !p.config.appSrc + '/styl/**/_*'])
//     .pipe(stylus({use: [nib(), jeet(), rupture()]}))
//     .pipe(gulp.dest('./dest/css'))
//     .pipe(connect.reload());
// });

// gulp.task('stylint', function() {
//   var stylint = require('gulp-stylint');
//   return gulp.src([p.config.appSrc + '/**/*.styl', './jayda/**/*.styl', '!./jayda/styl/lib**/*.styl'])
//     .pipe(stylint({config: '.stylintrc'}));
// });

// JADE ----------------------------------
gulp.task('jade', function() {
  gulp.src([p.config.appSrc + '/templates/**/*.jade', !p.config.appSrc + '/templates/**/_*.jade'])
    .pipe(jadeGlobbing())
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('dest'))
    .pipe(connect.reload());
});

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
  globby([
    p.config.appSrc + '/js/*.js',
    // p.config.appSrc + '/js/materialize/**/*.js',
    p.config.appSrc + '/components/**/*.js'
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

gulp.task('fonts', function () {
  return gulp.src(p.config.appSrc + '/fonts/**/*')
    .pipe(gulp.dest('dest/fonts'));
});

gulp.task('tree', function () {
  return gulp.src([p.config.appSrc + '/components/**/*.jade', p.config.appSrc + '/components/**/*.html', p.config.appSrc + '/components/**/*.js', p.config.appSrc + '/components/**/*.json'])
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

  gulp.src(p.config.appSrc + '/js/lib/**/*.js')
    .pipe(gulp.dest('dest/js/lib'));

  gulp.src('node_modules/materialize-css/bin/materialize.css')
    .pipe(gulp.dest('dest/css'));

  gulp.src('node_modules/materialize-css/font/**/*')
    .pipe(gulp.dest('dest/font'));

  gulp.src('node_modules/materialize-css/bin/materialize.js')
    .pipe(gulp.dest('dest/js/lib'));
});

// --------------------------------------
// JAYDA --------------------------------
// --------------------------------------

gulp.task('jayda-jade', function () {
  gulp.src(['./jayda/templates/**/*.jade', '!./jayda/templates/**/_*.jade'])
    .pipe(jadeGlobbing())
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dest/jayda'))
    .pipe(connect.reload());
});

gulp.task('jayda-stylus', function () {
  gulp.src(['./jayda/styl/**/*.styl', !p.config.appSrc + '/styl/**/_*'])
    .pipe(stylus({use: [nib(), jeet(), rupture()]}))
    .pipe(gulp.dest('./dest/jayda/css'))
    .pipe(connect.reload());
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
    .pipe(gulp.dest('./dest/jayda/js/'))
    .pipe(connect.reload());

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby([
    './jayda/js/jayda.js',
    './jayda/js/utils.js',
    './jayda/js/router.js',
    './jayda/js/jayda_jade.js',
    './jayda/js/jayda_html.js',
    './jayda/js/jayda_icons.js'
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


gulp.task('jayda-get-components', function () {
  gulp.src([p.config.appSrc + '/components/**/*.js', p.config.appSrc + '/components/**/*.json', p.config.appSrc + '/components/**/*.html'])
    .pipe(gulp.dest('dest/components'));

  gulp.src('jayda/js/lib/*.js')
    .pipe(gulp.dest('dest/jayda/js/lib'));
});

gulp.task('jayda-templatizer', function() {
    templatizer('./jayda/components/**/*.jade', './dest/jayda/js/compiled_patterns.js', {
      namespace: 'window.J.Jayda',
      dontremoveMixins: true
    });
});

gulp.task('jayda-images', function() {
  gulp.src('jayda/images/**/*')
    .pipe(gulp.dest('dest/images'));
});

gulp.task('jayda-font-icons', function() {
  return gulp.src(p.config.iconFontFile)
    .pipe(gulp.dest('dest/jayda/data'))
    .pipe(connect.reload());
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
    templatizer(p.config.appSrc + '/components/**/*.jade', './dest/js/compiled_patterns.js', {
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
  gulp.watch([p.config.appSrc + '/styl/**/*.styl', p.config.appSrc + '/components/**/*.styl'], ['stylus', 'stylint']);
  gulp.watch([p.config.appSrc + '/fonts/**/*'], ['fonts']);
  gulp.watch([p.config.appSrc + '/**/*.jade'], ['jade']);
  gulp.watch([p.config.appSrc + '/components/**/*.jade'], ['tree', 'templatizer']);
  gulp.watch([p.config.appSrc + '/js/**/*.js', p.config.appSrc + '/components/**/*.js', p.config.appSrc + '/components/**/*.html'], ['js', 'jayda-get-components']);

  // Jayda
  gulp.watch(['jayda/**/*.jade'], ['jayda-jade', 'jayda-templatizer']);
  gulp.watch(['jayda/js/**/*.js'], ['jayda-js']);
  gulp.watch(['jayda/styl/**/*.styl'], ['jayda-stylus', 'stylint']);
  gulp.watch(['jayda/images/**/*'], ['jayda-images']);
  gulp.watch(['jayda/data/icons.json'], ['jayda-font-icons']);
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
    [
      'libs',
      'js',
      'jayda-js',
      'jayda-get-components',
      'fonts',
      'jayda-images'
    ],
    [
    'tree'
    ],
    [
      // 'stylus',
      'jayda-stylus',
      'jayda-font-icons',
      // 'stylint',
      'jade',
      'jayda-jade',
      'templatizer',
      'jayda-templatizer'
    ],
    [
      'connect',
      'watch'
    ],
    callback);
});
