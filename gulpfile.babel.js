import gulp from 'gulp';

// Global Requirements
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import del from 'del';

// Image Requirements
import imagemin from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';

// CSS Requirements
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import moduleImporter from 'sass-module-importer';
import pleeease from 'gulp-pleeease';

// JS Requirements
import eslint from 'gulp-eslint';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config';

const configPublic = "./public";
const configSource = "./src";
const server = browserSync.create();

const config = {
  localsite: 'http://tosca.local:8888',
  assets: {
    mainPath: `${configPublic}/_assets/`,
    imgSrcPath: `${configSource}/images/**/*.+(jpeg|jpg|gif|png)`,
    svgSrcPath: `${configSource}/svg/**/*.svg`,
    imgDest: `${configPublic}/_assets/images`,
    svgDest: `${configPublic}/_assets/svg`,
  },
  scripts: {
    srcPath: `${configSource}/js/`,
    dest: `${configPublic}/_assets/js`,
    allScriptFiles: `${configSource}/js/**/*.js`,
    jsFile: 'index.js',
  },
  styles: {
    srcPath: `${configSource}/scss/`,
    dest: `${configPublic}/_assets/css`,
    allStyleFiles: `${configSource}/scss/**/*.scss`,
    scssFile: 'styles.scss',
  },
  pleeeaseOpt: {
    browsers: ['last 4 versions'],
    minifier: false,
  }
};

const deleteDirs = [`${config.assets.mainPath}css`, `${config.assets.mainPath}js`];

export function clean() {
  return del(deleteDirs);
}

export function compressImages() {
  return gulp
    .src(`${config.assets.imgSrcPath}`)
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imageminPngquant({
          speed: 1,
          quality: [0.9, 1],
        }),
      ]),
    )
    .pipe(gulp.dest(`${config.assets.imgDest}`));
};

export function compressSvgs() {
  return gulp
    .src(`${config.assets.svgSrcPath}`)
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [{ removeVieBox: false }],
        }),
      ]),
    )
    .pipe(gulp.dest(`${config.assets.svgDest}`));
};

export function scripts() {
  return gulp
    .src(`${config.scripts.srcPath}${config.scripts.jsFile}`)
    .pipe(webpack(require("./webpack.config")))
    .pipe(gulp.dest(config.scripts.dest));
}

export function styles() {
  return gulp
    .src(`${config.styles.srcPath}${config.styles.scssFile}`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ importer: moduleImporter() }))
    .pipe(pleeease(config.pleeeaseOpt))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(config.styles.dest))
    .pipe(server.stream());
}

function reloadPage(done) {
  server.reload();
  done();
}

// BrowserSync without Localhost
function serve(done) {
  server.init({
    server: {
      baseDir: "./public"
    }
  });
  done();
}

// BrowserSync with Localhost
// function serve(done) {
//   server.init({
//     ui: false,
//     notify: false,
//     proxy: {
//       target: config.localsite,
//     },
//   });
//   done();
// }

function watch() {
  gulp.watch(config.styles.allStyleFiles, gulp.series(styles));
  gulp.watch(config.scripts.allScriptFiles, gulp.series(scripts));
  gulp.watch(config.assets.imgSrcPath, gulp.series(compressImages));
  gulp.watch(config.assets.svgSrcPath, gulp.series(compressSvgs));
  gulp.watch(`${config.scripts.dest}/*.js`, gulp.series(reloadPage));
  gulp.watch(`${configPublic}/**/*.+(html|php)`, gulp.series(reloadPage));
}

const build = gulp.series(clean, styles, scripts, compressImages, compressSvgs, serve, watch);

export default build;
