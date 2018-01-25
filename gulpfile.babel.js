"use strict";
import gulp from "gulp";
import plumber from "gulp-plumber";
import {} from "del";

// Styling
import sass from "gulp-sass";
import {} from "css-mqpacker";
import cleanCSS from "gulp-clean-css";
import postCSS from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import {} from "sass-module-importer";

const config = {
  build: {
    prod: "./build",
    local: "./build_local"
  },
  assets: {
    localPath: "./build_local/_assets/",
    prodPath: "./build/_assets/"
  },
  styles: {
    srcPath: "./_src/scss/",
    dest: "./build/_assets/css/",
    stylesFile: ".styles.scss",
    allstylesFile: ".**/*.scss"
  }
};

export function clean(path) {
  return del([path]);
}

gulp.task("styles:build", () => {
  return gulp
    .src(config.srcPath.stylesFile)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ importer: moduleImporter() }))
    .pipe(postCSS())
    .pipe(cleanCSS())
    .pipe(souremaps.write("."))
    .pipe(gulp.dest(config.styles.dest));
});
