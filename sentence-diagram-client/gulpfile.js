const gulp = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function build(cb) {
  // body omitted
  cb();
}

function copy(cb) {
  gulp.src('./public/*').pipe(gulp.dest('../sentence-diagram-server/sentence-diagram-web/src/main/webapp'));
  cb();
}

exports.default = gulp.series(clean, build, copy);