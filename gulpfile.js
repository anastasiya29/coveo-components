const gulp = require("gulp"),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config.js'),
    paths = {};

gulp.task("compile-typescript", () => gulp
    .src('components.ts')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('.')));
