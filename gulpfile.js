const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('copy-from-ag-grid', () => {
    return gulp.src(['../../ag-grid/*', '../ag-grid/dist/**/*'], {base: '../../ag-grid'})
        .pipe(gulp.dest('./node_modules/ag-grid'));
});

gulp.task('copy-from-ag-grid-enterprise', () => {
    return gulp.src(['../../ag-grid-enterprise/*', '../../ag-grid-enterprise/dist/**/*'], {base: '../../ag-grid-enterprise'})
        .pipe(gulp.dest('./node_modules/ag-grid-enterprise'));
});

gulp.task('copy-from-ag-grid-angular', () => {
    return gulp.src(['../../ag-grid-angular/*', '../../ag-grid-angular/dist/**/*'], {base: '../../ag-grid-angular'})
        .pipe(gulp.dest('./node_modules/ag-grid-angular'));
});

gulp.task('clean-nm-ag-grid-enterprise', () => {
    del(['node_modules/ag-grid-enterprise', '!node_modules']);
});

gulp.task('clean-nm-ag-grid', () => {
    del(['node_modules/ag-grid', '!node_modules']);
});

gulp.task('copy-nm-dirs', (callback) => {
    runSequence('copy-from-ag-grid', 'copy-from-ag-grid-enterprise', callback);
});

gulp.task('watch', ['copy-nm-dirs'], () => {
    gulp.watch(['../ag-grid/dist/**/*', '../ag-grid/src/**/*'], ['copy-from-ag-grid']);
    gulp.watch(['../ag-grid-enterprise/dist/**/*', '../ag-grid-enterprise/src/**/*'], ['copy-from-ag-grid-enterprise']);
});