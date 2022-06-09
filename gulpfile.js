const { src, dest, watch, series } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
    // Compliar SASS
    // 1.- Identificar el archivo, 2.- Compilar 3.- Guardar el .css
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            /* outputStyle: 'compressed' */
        }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))

    done();
};

function imagenes(done) {

    src('src/img/**/*')
        .pipe(imagemin({
            optimizationLevel: 3
        }))
        .pipe(dest('build/img'));

    done();
}

function versionWebp(done) {
    src('src/img/**/*.{png,jpg}')
        .pipe(webp({
            quality: 50
        }))
        .pipe(dest('build/img'));
    done();
};

function versionAvif(done) {
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif({
            quality: 50
        }))
        .pipe(dest('build/img'));
};

function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
};

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

// Series - Se inicia una tarea y hasta que finaliza continua con la siguiente
// Parallel - Se inician las tareas de manera simultanea