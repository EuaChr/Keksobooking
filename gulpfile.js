"use strict";

var gulp = require("gulp"),
    plumber = require("gulp-plumber"),
    server = require("browser-sync").create(),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    sass = require("gulp-sass"),
    minify = require("gulp-csso"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    svgstore = require("gulp-svgstore"),
    posthtml = require("gulp-posthtml"),
    del = require("del"),
    uglify = require('gulp-uglify-es').default,
    concat = require('gulp-concat'),
    include = require("posthtml-include");


/* Paths to source/build/watch files
=========================*/

var path = {
    build: {
        html: "build",
        js: "build/assets/js/",
        css: "build/assets/css/",
        img: "build/assets/img/"
    },
    src: {
        html: "src/pages/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/css/style.css",
        img: "src/assets/img/**/*.*"
    },
    watch: {
        html: "src/pages/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        img: "src/assets/img/**/*.*"
    },
    clean: "./build",
    json: "./src/data/data.json"
};


/* Tasks
=========================*/


gulp.task("serve", async function () {
  server.init({
    server: "build/"
  });

  gulp.watch(path.watch.html).on("change", gulp.series('html:build'));
  gulp.watch(path.watch.css).on("change", gulp.series('css:build'));

  gulp.watch(path.watch.img).on("change", gulp.series('image:build'));
  gulp.watch(path.watch.js).on("change", gulp.series('js:build'));
});

gulp.task("css:build", async function () {
  gulp.src(path.src.css)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(path.build.css))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.css))

    .pipe(server.stream());
});

gulp.task('js:build', async function() {
  return gulp.src('src/assets/js/**/*.js')
  .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/assets/js/'))
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest(path.build.js))
    .pipe(server.reload({stream: true}));
});

gulp.task("html:build", async function () {
  return gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(path.build.html))
    .pipe(server.reload({stream: true}));
});

gulp.task("image:build", async function () {
  gulp.src(path.src.img)
      .pipe(imagemin([
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ]))
      .pipe(gulp.dest(path.build.img));
});


gulp.task("clean", async function () {
  return del("build");
});

var build = gulp.series(
  "clean",
  "html:build",
  "css:build",
  "js:build",
  "image:build",
  "serve"

  );

gulp.task("default", build);
