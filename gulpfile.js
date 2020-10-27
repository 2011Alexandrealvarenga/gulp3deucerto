const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { src, series, parallel, dest, watch } = require('gulp');

// busca todos os js
const jsPath = 'src/assets/js/**/*.js';

// busca todos os css
const cssPath = 'src/assets/css/**/*.css';


function copyHtml() {
  // busca todo os html src/*.html - e joga no destino ('dist')
  return src('src/*.html').pipe(gulp.dest('dist'));
}

function imgTask() {
  // busca todas as imagens e minificou e jogou na pasta dist/images
  return src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
}

function jsTask() {
  return src(jsPath)
    .pipe(sourcemaps.init())

    // concatena todos arquivos js
    .pipe(concat('all.js'))

    // terser minifica js
    .pipe(terser())
    .pipe(sourcemaps.write('.'))

    // saida dos arquivos
    .pipe(dest('dist/assets/js'));
}

function cssTask() {
  return src(cssPath)
    .pipe(sourcemaps.init())

    // concatena todos arquivos css
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer(), cssnano()])) //not all plugins work with postcss only the ones mentioned in their documentation
    .pipe(sourcemaps.write('.'))

    // saida dos arquivos
    .pipe(dest('dist/assets/css'));
}

function watchTask() {
  watch([cssPath, jsPath], { interval: 1000 }, parallel(cssTask, jsTask));
}

// funções 
exports.cssTask = cssTask;
exports.jsTask = jsTask;
exports.imgTask = imgTask;
exports.copyHtml = copyHtml;
exports.default = series(
  parallel(copyHtml, imgTask, jsTask, cssTask),
  watchTask
);
