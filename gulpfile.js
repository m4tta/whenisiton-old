var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var es = require('event-stream');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: "localhost:3000",
    port: 7000
  });

  gulp.watch(["public/**/*.*", "app/views/**/*.*"]).on("change", reload);
});

gulp.task('wiredep', function() {
  gulp.src('./app/views/layouts/main.handlebars')
    // Inject all bower dependencies
    .pipe(inject(gulp.src(bowerFiles(), {
      read: false
    }), {
      name: 'bower'
    }))
    // grab all other js/css files
    .pipe(inject(es.merge(
      gulp.src('./public/css/*.css', {
        read: false
      }),
      gulp.src('./public/js/*.js', {
        read: false
      })
    )))
    .pipe(gulp.dest('./app/views/layouts/'));
});
