const {src, dest, watch, parallel } = require("gulp");

//CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require("gulp-plumber");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Imagenes
const cache = require('gulp-cache');
const imageMin = require('gulp-imagemin');
const webp = import("gulp-webp");
const avif = import('gulp-avif');

//js
const terser = require('gulp-terser-js');

function css(done){
    src('src/scss/**/*.scss')     //identificar el archivo de sass
        .pipe(sourcemaps.init())
        .pipe(plumber())          //para que no se detenga la ejecucion
        .pipe(sass())            //compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); //almacenar en el disco duro
    done(); //el callback avisa a gulp que termino
}

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imageMin(opciones)))
        .pipe(dest('build/img'));
    done();
}

async function versionWebp(done) {
    const opciones = {
        quality: 50
    };
    const webpModule = await webp;
    src('src/img/**/*.{png,jpg}')
        .pipe(webpModule.default(opciones))
        .pipe(dest('build/img'));
    done();
}


async function versionAvif(done) {
    const opciones = {
        quality: 50
    };
    const avifModule = await avif;
    src('src/img/**/*.{png,jpg}')
        .pipe(avifModule.default(opciones))
        .pipe(dest('build/img'));
    done();
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write())
        .pipe(dest('build/js'));
    done()
}


function dev(done){
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', javascript)
    done();
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);

