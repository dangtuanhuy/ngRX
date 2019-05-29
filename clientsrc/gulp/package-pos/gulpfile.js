var gulp = require('gulp');
var fs = require('fs');
var rename = require("gulp-rename");
var run = require('gulp-run');
var del = require('del');

gulp.task('pos', function () {
    const releasePackagesPath = '../../release/packages';
    const appDir = `${releasePackagesPath}/app`;

    return del([
        `${appDir}/**/*`,
        `${releasePackagesPath}/app.asar`
    ], { force: true }).then(() => {
        if (!fs.existsSync(appDir)) {
            fs.mkdirSync(appDir);
        }

        gulp.src('../../package.json.realm')
            .pipe(rename('package.json'))
            .pipe(gulp.dest(appDir));

        console.log(`running npm install in ${appDir}`);
        run(`cd ${appDir} && npm install && cd ../POS-win32-x64/resources && asar extract app.asar app`).exec('', function () {
            console.log(`run npm install success`);

            console.log(`copy app asar`);
            gulp.src([`${releasePackagesPath}/POS-win32-x64/resources/app/**/*`]).pipe(gulp.dest(appDir));
            console.log(`copy app asar success`);

            console.log(`pack new app.asar`);
            run(`cd ${releasePackagesPath} && asar pack app app.asar`).exec('', function () {
                console.log(`pack new app.asar success`);
                del([
                    `${releasePackagesPath}/POS-win32-x64/resources/app`
                ], { force: true }).then(() => {
                    gulp.src(`${releasePackagesPath}/app.asar`)
                        .pipe(gulp.dest(`${releasePackagesPath}/POS-win32-x64/resources`));
                });
            });
        });
    });

});

gulp.task('pos-staging', function () {
    const releasePackagesPath = '../../release/packages';
    const appDir = `${releasePackagesPath}/app`;

    return del([
        `${appDir}/**/*`,
        `${releasePackagesPath}/app.asar`
    ], { force: true }).then(() => {
        if (!fs.existsSync(appDir)) {
            fs.mkdirSync(appDir);
        }

        gulp.src('../../package.json.realm')
            .pipe(rename('package.json'))
            .pipe(gulp.dest(appDir));

        console.log(`running npm install in ${appDir}`);
        run(`cd ${appDir} && npm install && cd ../POSStaging-win32-x64/resources && asar extract app.asar app`).exec('', function () {
            console.log(`run npm install success`);

            console.log(`copy app asar`);
            gulp.src([`${releasePackagesPath}/POSStaging-win32-x64/resources/app/**/*`]).pipe(gulp.dest(appDir));
            console.log(`copy app asar success`);

            console.log(`pack new app.asar`);
            run(`cd ${releasePackagesPath} && asar pack app app.asar`).exec('', function () {
                console.log(`pack new app.asar success`);
                del([
                    `${releasePackagesPath}/POSStaging-win32-x64/resources/app`
                ], { force: true }).then(() => {
                    gulp.src(`${releasePackagesPath}/app.asar`)
                        .pipe(gulp.dest(`${releasePackagesPath}/POSStaging-win32-x64/resources`));
                });
            });
        });
    });
});

gulp.task('pos-prod', function () {
    const releasePackagesPath = '../../release/packages';
    const appDir = `${releasePackagesPath}/app`;

    return del([
        `${appDir}/**/*`,
        `${releasePackagesPath}/app.asar`
    ], { force: true }).then(() => {
        if (!fs.existsSync(appDir)) {
            fs.mkdirSync(appDir);
        }

        gulp.src('../../package.json.realm')
            .pipe(rename('package.json'))
            .pipe(gulp.dest(appDir));

        console.log(`running npm install in ${appDir}`);
        run(`cd ${appDir} && npm install && cd ../POSProd-win32-x64/resources && asar extract app.asar app`).exec('', function () {
            console.log(`run npm install success`);

            console.log(`copy app asar`);
            gulp.src([`${releasePackagesPath}/POSProd-win32-x64/resources/app/**/*`]).pipe(gulp.dest(appDir));
            console.log(`copy app asar success`);

            console.log(`pack new app.asar`);
            run(`cd ${releasePackagesPath} && asar pack app app.asar`).exec('', function () {
                console.log(`pack new app.asar success`);
                del([
                    `${releasePackagesPath}/POSProd-win32-x64/resources/app`
                ], { force: true }).then(() => {
                    gulp.src(`${releasePackagesPath}/app.asar`)
                        .pipe(gulp.dest(`${releasePackagesPath}/POSProd-win32-x64/resources`));
                });
            });
        });
    });

});

gulp.task('pos-clean', function () {
    const releasePackagesPath = '../../release/packages';

    return del([
        `${releasePackagesPath}/**/*`
    ], { force: true });
});

gulp.task('pos-winstaller-clean', function () {
    const releasePackagesPath = '../../release';

    return del([
        `${releasePackagesPath}/**/*`
    ], { force: true });
});