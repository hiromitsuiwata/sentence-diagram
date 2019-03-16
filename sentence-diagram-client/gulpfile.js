const gulp = require('gulp');

function copy(cb) {
  gulp.src('./public/*').pipe(gulp.dest('../sentence-diagram-server/sentence-diagram-web/src/main/webapp'));
  cb();
}

exports.default = gulp.series(copy);
