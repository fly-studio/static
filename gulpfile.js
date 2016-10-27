var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var data = require('gulp-data');
// 编译Sass
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// 合并，压缩common
gulp.task('common-scripts', function() {
    gulp.src(['js/common/utils.js','js/common/polyfill.js','js/common/query.js'])
    	.pipe(jshint())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('common.js'))
        //.pipe(gulp.dest('js/'))
        .pipe(uglify({output: {ascii_only:true}}))
        .pipe(header('/*! ${name} ${date}*/\n', { name : 'common', date : (new Date).toLocaleString()} ))
        .pipe(sourcemaps.write('./common'))
        .pipe(gulp.dest('js/'));
});
// 分散压缩
gulp.task('scripts', function() {
    gulp.src(['js/GPS.js', 'js/htmldiff.js'])
        .pipe(data(function (file) {
            return {
                filename: path.basename(file.path),
                dir: path.dirname(file.path)
            };
        }))
        .pipe(uglify({output: {ascii_only:true}}))
        .pipe(header('/*! ${filename} ${date}*/\n', { date : (new Date).toLocaleString()} ))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('js/'));

});
gulp.task('watch', function() {
    gulp.watch(['js/common/utils.js','js/common/polyfill.js','js/common/query.js'], ['common-scripts']);
    gulp.watch(['js/GPS.js', 'js/htmldiff.js'], ['scripts']);
});
// 默认任务
gulp.task('default', ['watch']);
