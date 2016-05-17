var gulp = require('gulp'),
    bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    es = require('event-stream');


gulp.task('wiredep', function () {
    gulp.src('./app/views/layouts/main.handlebars')
        // Inject all bower dependencies
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
        // grab all other js/css files
        .pipe(inject(es.merge(
            gulp.src('./public/css/*.css', {read: false}),
            gulp.src('./public/js/*.js', {read: false})
        )))
        .pipe(gulp.dest('./app/views/layouts/'));
});
