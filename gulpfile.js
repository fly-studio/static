var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
// 编译Sass
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src(['js/common/utils.js','js/common/polyfill.js','js/common/query.js'])
    	.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('common.js'))
        //.pipe(gulp.dest('js/'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./common'))
        .pipe(header('/*! ${name} ${date}*/\n', { name : 'common', date : (new Date).toLocaleString()} ))
        .pipe(gulp.dest('js/'));
});
gulp.task('watch', function() {
    gulp.watch(['js/common/utils.js','js/common/polyfill.js','js/common/query.js'], ['scripts']);
});
// 默认任务
gulp.task('default', ['watch']);
