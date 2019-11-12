/* Loadings
=========================*/

// Load Gulp
const { src, dest, task, watch, series, parallel } = require('gulp');

// CSS related plugins
var postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    sass = require("gulp-sass"),
    minify = require("gulp-csso");

// Image/svg related plugins
var imagemin = require("gulp-imagemin"),
    svgstore = require("gulp-svgstore"),
    posthtml = require("gulp-posthtml"),
    include = require("posthtml-include");

// JS related plugins
var uglify = require('gulp-uglify-es').default;

// Utility plugins
var plumber = require("gulp-plumber"),
    rename = require("gulp-rename"),
    del = require("del"),
    concat = require('gulp-concat');

// Browers related plugins
var server = require("browser-sync").create();


/* Paths to source/build/watch files
=========================*/

var path = {
    build: {
        html: "build",
        js: "build/assets/js/",
        vendors: "build/assets/vendors/",
        css: "build/assets/css/",
        img: "build/assets/img/",
        fonts: "build/assets/fonts/"
    },
    src: {
        html: "src/pages/**/*.html",
        js: "src/assets/js/**/*.js",
        vendors: "src/assets/vendors/**/*.*",
        css: "src/assets/css/style.css",
        img: "src/assets/img/**/*.*",
        svg: "src/assets/img/icon-*.svg",
        fonts: "src/assets/fonts/**/*.*"
    },
    watch: {
        html: "src/pages/**/*.html",
        layout: "src/templates/**/*.html",
        vendors: "src/assets/vendors/**/*.*",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        img: "src/assets/img/**/*.*",
        fonts: "src/assets/fonts/**/*.*"
    },
    clean: "./build",
    json: "./src/data/data.json"
};

/* Tasks
=========================*/

function serve(done) {
  server.init({
    server: "build/"
  });
  watch(path.watch.html).on("change", series('html', reload));
  watch(path.watch.css).on("change", series('css', reload));
  watch(path.watch.img).on("change", series('images', 'sprite', reload));
  watch(path.watch.js).on("change", series('js', reload));
  watch(path.watch.fonts).on("change", series('fonts', reload));

  done();
};

function reload(done) {
  server.reload();
  done();
};

function triggerPlumber( src_file, dest_file ) {
  return src( src_file )
    .pipe( plumber() )
    .pipe( dest( dest_file ) );
};

function css(done) {
  src(path.src.css)
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer()
  ]))
  .pipe(dest(path.build.css))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(dest(path.build.css))
  .pipe(server.stream());

  done();
};

function js(done) {
  src('src/assets/js/**/*.js')
  .pipe(plumber())
  .pipe(concat('main.js'))
  .pipe(dest('build/assets/js/'))
  .pipe(uglify())
  .pipe(rename("main.min.js"))
  .pipe(dest(path.build.js))
  .pipe(server.reload({stream: true}));

  done();
};

function images() {
  return src(path.src.img)
  .pipe(plumber())
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
  .pipe(dest(path.build.img));
};

function sprite(done) {
src(path.src.svg)
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(dest(path.build.img));
  done();
};

function fonts() {
  return triggerPlumber( path.src.fonts, path.build.fonts );
};

function html() {
  return triggerPlumber( path.src.html, path.build.html );
};

function clean() {
  return del("build");
};

task("css", css);
task("js", js);
task("images", images);
task("sprite", sprite);
task("fonts", fonts);
task("html", html);
task("clean", clean);
task("serve", serve);

task("default", series(clean, css, js, images, sprite, fonts, html, serve));