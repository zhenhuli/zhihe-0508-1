const gulp = require('gulp');
const connect = require('gulp-connect');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  src: {
    html: 'src/*.html',
    css: 'src/css/*.css',
    js: 'src/js/*.js'
  },
  dist: {
    root: 'dist',
    css: 'dist/css',
    js: 'dist/js'
  }
};

function html() {
  return gulp.src(paths.src.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(connect.reload());
}

function css() {
  return gulp.src(paths.src.css)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(connect.reload());
}

function js() {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(connect.reload());
}

function server() {
  connect.server({
    root: paths.dist.root,
    port: 8080,
    livereload: true
  });
}

function watchFiles() {
  gulp.watch(paths.src.html, html);
  gulp.watch(paths.src.css, css);
  gulp.watch(paths.src.js, js);
}

const build = gulp.parallel(html, css, js);
const watch = gulp.parallel(watchFiles, server);
const dev = gulp.series(build, watch);

exports.html = html;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.dev = dev;
exports.default = dev;
