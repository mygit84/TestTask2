"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var newer = require('gulp-newer');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var objectFit = require('postcss-object-fit-images');
var uglify = require('gulp-uglify');
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");

gulp.task("style", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      objectFit()
    ]))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: {
      baseDir: 'build',
      index: 'index.html'
    },
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("style"));
  gulp.watch('sourse/**/*.{png,jpg,svg}', gulp.series('images', 'sprite', 'refresh'));
  gulp.watch('source/**/*.js', gulp.series('scripts', 'refresh'));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task('images', function () {
  return gulp.src([
      'source/img/**/*.{png,jpg,svg}',
      '!source/img/sprite/*.svg'
    ])
    .pipe(newer('build/img'))
    .pipe(imagemin([
      pngquant({
        speed: 1,
        quality: [0.7, 0.9]
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      mozjpeg({
        quality: 90
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      })
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img/webp"));
});

gulp.task('sprite', function () {
  return gulp.src('source/img/sprite/*.svg')
    .pipe(newer('build/img'))
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      })
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task('scripts:vendor', function() {
  return gulp.src('source/js/vendor/**/*.js')
  .pipe(plumber())
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('build/js'));
});

gulp.task('scripts', function() {
  return gulp.src([
      'source/js/global/**/*.js',
      'source/components/**/*.js'
    ])
  .pipe(plumber())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('build/js'));
});

gulp.task('copy', function() {
  return gulp.src([
      'source/fonts/**/*.{woff,woff2}',
      'source/img/**/*.{png,jpg,svg}'
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'webp',
  'sprite',
  'style',
  'scripts:vendor',
  'scripts',
  'html'
));

gulp.task('build:minify', gulp.series(
  'clean',
  'copy',
  'images',
  'webp',
  'sprite',
  'style',
  'scripts:vendor',
  'scripts',
  'html'
));

gulp.task("start", gulp.series("build", "server"));
