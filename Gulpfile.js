var gulp = require("gulp");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var minifyCSS = require("gulp-cssmin");

gulp.task("js", function() {
  gulp.src(["js/*.js"])            // Read the files
    .pipe(concat("open-campus.js"))   // Combine into 1 file
    .pipe(gulp.dest("dist/js"))            // Write non-minified to disk
    // .pipe(uglify())                     // Minify
    // .pipe(rename({extname: ".min.js"})) // Rename to ng-quick-date.min.js
    // .pipe(gulp.dest("dist"))            // Write minified to disk
});
gulp.task("css", function() {
  gulp.src(["css/*.css"])            // Read the files
    .pipe(concat("open-campus.css"))   // Combine into 1 file
    .pipe(gulp.dest("dist/css"))            // Write non-minified to disk
    .pipe(minifyCSS())                     // Minify
    .pipe(rename({extname: ".min.css"})) // Rename to ng-quick-date.min.js
    .pipe(gulp.dest("dist"))            // Write minified to disk
});
gulp.task("default", function() {
  gulp.start("js");
  gulp.start("css");
});