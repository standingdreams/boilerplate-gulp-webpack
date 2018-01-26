"use strict";
import gulp from "gulp";
import plumber from "gulp-plumber";
import del from "del";

// Styling
import autoprefixer from "autoprefixer";
import cleanCSS from "gulp-clean-css";
import cssMQPacker from "css-mqpacker";
import moduleImporter from "sass-module-importer";
import postCSS from "gulp-postcss";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";

// BrowserSync
import browserSync from "browser-sync";
const server = browserSync.create();
function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: "./public"
    }
  });
  done();
}

// Scripts
import webpack from "webpack-stream";
const config = {
  base: "./public",
  assets: "./public/_assets/",
  styles: {
    srcPath: "./src/scss/",
    dest: "./public/_assets/css",
    stylesFile: "styles.scss",
    allStyleFiles: "./src/scss/**/*.scss",
    postCSSPlugins: [
      autoprefixer({ browsers: "last 4 versions" }),
      cssMQPacker({ sort: true })
    ]
  },
  scripts: {
    srcPath: "./src/js/",
    dest: "./public/_assets/js",
    allScriptFiles: "./src/js/**/*.js",
    jsFile: "index.js"
  }
};

export function clean() {
  return del([config.assets]);
}

export function styles() {
  return gulp
    .src(`${config.styles.srcPath}${config.styles.stylesFile}`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ importer: moduleImporter() }))
    .pipe(postCSS(config.styles.postCSSPlugins))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(config.styles.dest))
    .pipe(server.stream());
}

export function scripts() {
  return gulp
    .src(`${config.scripts.srcPath}${config.scripts.jsFile}`)
    .pipe(webpack(require("./webpack.config")))
    .pipe(gulp.dest(config.scripts.dest));
}

gulp.task("styles:build", styles);
gulp.task("scripts:build", scripts);

function watch() {
  gulp.watch(config.styles.allStyleFiles, gulp.series("styles:build"));
  gulp.watch(
    config.scripts.allScriptFiles,
    gulp.series("scripts:build", reload)
  );
  gulp.watch(`${config.base}/*.html`, gulp.series(scripts, reload));
  gulp.watch(`${config.base}/*.php`, gulp.series(scripts, reload));
}

const build = gulp.series(clean, "styles:build", "scripts:build", serve, watch);

export default build;
