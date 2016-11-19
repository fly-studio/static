var gulp = require('gulp');
var path = require('path');
var util = require("gulp-util");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var data = require('gulp-data');
var stripDebug = require('gulp-strip-debug');
var vinylPaths = require('vinyl-paths');
var minifyCss = require('gulp-minify-css');
var del = require('del');
var map = require('map-stream');
var stylish = require('jshint-stylish');
//var vinylPaths = require('vinyl-paths');
// 编译Sass
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// 合并，压缩common
gulp.task('common-scripts', function() {
    gulp.src(['js/common/utils.js','js/common/polyfill.js','js/common/query.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(jshint({loopfunc:true, maxerr: 50}))
        .pipe(jshint.reporter(stylish))
        .pipe(map(function(file, cb){
            if (file.jshint.success) {
                util.log('0 error. JSHINT success!');
                return cb(null, file);
            }
        }))
        .pipe(concat('common.js'))
        //.pipe(gulp.dest('js/'))
        .pipe(uglify({output: {ascii_only:true}}))
        .pipe(header('/*! ${name} ${date}*/\n', { name : 'common', date : (new Date).toLocaleString()} ))
        .pipe(sourcemaps.write('./common'))
        .pipe(gulp.dest('js/'))
        .pipe(map(function(file, cb){
            util.log('created ', file.path);
            return cb(null, file);
        }));
});
// 分散压缩
gulp.task('watch', function() {
    gulp.watch(['js/common/utils.js','js/common/polyfill.js','js/common/query.js'], ['common-scripts']);
    gulp.watch(['js/GPS.js', 'js/htmldiff.js', 'js/jquery.uploader.js', 'js/jquery.validate.addons.js', 'css/uploader.css'], function(e){
        var ext = path.extname(e.path);
        var dir = path.dirname(e.path);
        if (e.type == 'deleted')
        {
          var filename = path.basename(e.path, ext);
          del.sync(path.join(dir,filename+'.min'+ext));
        }
        else
        {
            switch (ext.toLowerCase())
            {
                case '.js':
                    gulp.src(e.path)
                    .pipe(jshint({loopfunc:true, maxerr: 50}))
                    .pipe(jshint.reporter(stylish))
                    .pipe(map(function(file, cb){
                        if (file.jshint.success) {
                            util.log('0 error. JSHINT success!');
                            return cb(null, file);
                        }
                    }))
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(data(function (file) {
                        return {
                            filename: path.basename(file.path),
                            dir: path.dirname(file.path)
                        };
                    }))
                    .pipe(uglify({output: {ascii_only:true}}))
                    .pipe(header('/*! ${filename} ${date}*/\n', { date : (new Date).toLocaleString()} ))
                    .pipe(rename({suffix:'.min'}))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(dir))
                    .pipe(map(function(file, cb){
                        util.log('created ', file.path);
                        return cb(null, file);
                    }));
                    break;
                case '.css':
                    gulp.src(e.path)
                    .pipe(csslint())
                    .pipe(csslint.formatter())
                    .pipe(data(function (file) {
                        return {
                            filename: path.basename(file.path),
                            dir: path.dirname(file.path)
                        };
                    }))
                    .pipe(minifyCss())
                    .pipe(header('/*! ${filename} ${date}*/\n', { date : (new Date).toLocaleString()} ))
                    .pipe(rename({suffix:'.min'}))
                    .pipe(gulp.dest(dir))
                    .pipe(map(function(file, cb){
                        util.log('created ', file.path);
                        return cb(null, file);
                    }));
                    break;
            }
        }
    });
});
// 默认任务
gulp.task('default', ['watch']);
