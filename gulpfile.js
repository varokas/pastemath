var gulp = require('gulp');
var bower = require('gulp-bower');
var rimraf = require('gulp-rimraf');

gulp.task('default', function() {
  bower()
    .pipe(gulp.dest('bower_components/'));

  rimraf('./lib');

  gulp.src('bower_components/normalize-css/normalize.css')
    .pipe(gulp.dest('lib/normalize'));
  gulp.src('bower_components/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('lib/font-awesome/css'));
  gulp.src('bower_components/font-awesome/fonts/*')
    .pipe(gulp.dest('lib/font-awesome/fonts'));
  gulp.src('bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('lib/jquery'));
  gulp.src('bower_components/angular/angular.min.js')
    .pipe(gulp.dest('lib/angular'));
  gulp.src('bower_components/mathjs/dist/math.min.js')
    .pipe(gulp.dest('lib/mathjs'));
});

gulp.task('dist', function() {

});
