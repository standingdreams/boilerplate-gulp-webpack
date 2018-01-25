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

const config = {
  build: {
    prod: "./build",
    local: "./build_local"
  },
  assets: "./public/_assets/",
  styles: {
    srcPath: "./src/scss/",
    dest: "public/_assets/css",
    stylesFile: "styles.scss",
    allstylesFile: ".**/*.scss",
    postCSSPlugins: [
      autoprefixer({ browsers: "last 4 versions" }),
      cssMQPacker({ sort: true })
    ]
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
    .pipe(gulp.dest(config.styles.dest));
}

gulp.task("styles:build", styles);

const buildStyles = gulp.series(clean, "styles:build");

export default buildStyles;
