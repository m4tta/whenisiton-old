var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var postcss = require('gulp-postcss')
var cssnano = require('cssnano');
var cssnext = require('postcss-cssnext');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var del = require('del');
var gutil = require('gulp-util');
var merge2 = require('merge2');
var bowerMain = require('bower-main');
var bowerMainJavaScriptFiles = bowerMain('js', 'min.js');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: "localhost:3000",
    port: 7000
  });
  gulp.watch(["./public/**/*.*", "./app/views/**/*.*"]).on("change", reload);
});

gulp.task('clean', function() {
  var paths = del.sync(['tmp/*.js', 'public/**']);
  if (paths.length>=1) gutil.log('Cleaned files and folders:\n', gutil.colors.red(paths.join('\n')));
});

gulp.task('build', function(cb) {
  runSequence(['scripts', 'scripts:vendor', 'css', 'images'], 'wiredep', cb);
});

gulp.task('build:clean', function(cb) {
  runSequence('clean', ['scripts', 'scripts:vendor', 'css', 'images'], 'wiredep', cb);
});

gulp.task('scripts', function(cb) {
  pump([
      gulp.src('./client/js/*.js'),
      process.env.NODE_ENV === 'production' ? concat('scripts.js') : gutil.noop(),
      process.env.NODE_ENV === 'production' ? uglify() : gutil.noop(),
      gulp.dest('./public/js')
    ],
    cb
  );
});

gulp.task('scripts:vendor', function(cb) {
  if (process.env.NODE_ENV === 'production') {
    pump([
      merge2(
        gulp.src(bowerMainJavaScriptFiles.minified),
        pump([
          gulp.src(bowerMainJavaScriptFiles.minifiedNotFound),
          concat('tmp.min.js'),
          uglify()
        ])),
      concat('vendor-scripts.min.js'),
      gulp.dest('./public/js')
    ], cb);
  } else {
    pump([
      gulp.src(bowerMainJavaScriptFiles.normal),
      gulp.dest('./public/js')
    ], cb);
  }
});

gulp.task('images', function(cb) {
  pump([
    gulp.src('./client/images/*'),
    imagemin(),
    gulp.dest('./public/images')
  ], cb);
});

gulp.task('css', function(cb) {
  var processors = [cssnext()];
  if (process.env.NODE_ENV === 'production') processors.push(cssnano());
  pump([
    gulp.src('./client/css/*.pcss'),
    postcss(processors),
    process.env.NODE_ENV === 'production' ? concat('style.css') : rename({extname: '.css'}),
    gulp.dest('./public/css')
  ], cb);
});

gulp.task('wiredep', function() {
  gulp.src('./app/views/layouts/main.handlebars')
    .pipe(inject(merge2(
      gulp.src('./public/css/*.css', {
        read: false
      }),
      gulp.src('./public/js/*.js', {
        read: false
      })
    )))
    .pipe(gulp.dest('./app/views/layouts/'));
});

gulp.task('watch', function() {
  gulp.watch('./client/css/*.pcss', ['css']);
  gulp.watch('./client/js/*.js', ['scripts']);
});

gulp.task('watch:styles', function() {
  gulp.watch('./client/css/*.pcss', ['css']);
});

gulp.task('watch:scripts', function() {
  gulp.watch('./client/js/*.js', ['scripts']);
});
