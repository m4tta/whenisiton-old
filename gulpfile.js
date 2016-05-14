var gulp = require('gulp'),
    bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    es = require('event-stream');
 
  
gulp.task('wiredep', function () {
    gulp.src('./app/client/index.html')
        // Inject all bower dependencies
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
        // grab all other js/css files 
        .pipe(inject(es.merge(
            gulp.src('./app/client/css/*.css', {read: false}),
            gulp.src('./app/client/js/*.js', {read: false})
        ), {relative: true}))
        .pipe(gulp.dest('./app/client/'));     
});