const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('watch', ['copy-nm-dirs'], () => {
    gulp.watch([
            './node_modules/ag-grid/dist/lib/**/*',
            './node_modules/ag-grid-enterprise/dist/lib/**/*',
            './node_modules/ag-grid-angular/dist/**/*',
            './src/app/**/*'
        ],
        ['copy-from-ag-grid']);
});