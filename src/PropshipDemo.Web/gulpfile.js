/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    merge = require('merge'),
    fs = require("fs"),
    clean = require('gulp-clean');

var webroot = "./wwwroot/";

var paths = {
    npm: './node_modules/',
    lib: webroot + "/lib/",
    tsSource: './TypeScript/**/*.ts',
    tsOutput: webroot + '/appScripts/',
    tsDef: "./TypeScript/definitions/"
}

gulp.task("scriptsNStyles", () => {
    gulp.src([
            'core-js/client/**',
            'systemjs/dist/system.src.js',
            'reflect-metadata/**',
            'rxjs/**',
            'zone.js/dist/**',
            'angular2/**',
            'jquery/dist/jquery.*js',
            'bootstrap/dist/js/bootstrap.*js',
    ], {
        cwd: "node_modules/**"
    })
        .pipe(gulp.dest(paths.lib));
});

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: false,
    module: 'AMD',
    removeComments: true
});

// Delete the dist directory
gulp.task('clean', function () {
    return gulp.src(paths.lib)
        .pipe(clean());
});

gulp.task('ts-compile', function () {
    var tsResult = gulp.src(paths.tsSource)
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest(paths.tsDef)),
        tsResult.js.pipe(gulp.dest(paths.tsOutput))
    ]);
});

gulp.task('watch', ['ts-compile'], function () {
    gulp.watch(paths.tsDef, ['ts-compile']);
});

gulp.task('default', ['scriptsNStyles', 'watch']);