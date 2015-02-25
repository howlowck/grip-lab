var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['output_dev/**']).on('change', livereload.changed);
});

gulp.task('sass', function () {
    return gulp.src('source/css/default.scss')
        .pipe(sass({sourcemapPath: '../../source/css'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('output_dev/built'));
});

gulp.task('browserify', function () {
   return browserify('./source/js/index.js')
       .bundle()
       .pipe(source('index.js'))
       .pipe(gulp.dest('output_dev/built'));
});

gulp.task('default', function () {
    gulp.start('watch');
    gulp.start('sass');
    gulp.start('browserify');

    gulp.watch(['./source/css/**/*.scss'], ['sass']);
    gulp.watch(['./source/js/**/*'], ['browserify']);
});