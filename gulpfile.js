'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    mocha = require('gulp-mocha');

gulp.task('lint', function() {
    return gulp.src([
            'gulpfile.js',
            'src/**/*.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('lint-tests', function() {
    return gulp.src('test/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('post-lint', function() {
    return gulp.src('dist/measurement.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('test', ['build'], function() {
    return gulp.src('test/**/*.js')
        .pipe(mocha({ reporter: 'list' }));
});

gulp.task('build', ['lint'], function() {
    return gulp.src('src/measurement.js')
        .pipe(browserify())
        .pipe(gulp.dest('./dist'))

        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))

        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['test'], function() {
    // Tests
    gulp.watch('test/**/*.js', ['test']);

    // Linting Tasks
    gulp.watch('**/*.js', ['lint']);

    // Building Tasks
    gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['watch']);
