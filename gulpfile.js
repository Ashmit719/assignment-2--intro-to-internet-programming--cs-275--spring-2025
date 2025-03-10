const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const sourcemaps = require(`gulp-sourcemaps`);
const browserSync = require(`browser-sync`).create();

// Lint JS
gulp.task(`lint-js`, function () {
    return gulp.src(`js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Lint CSS
gulp.task(`lint-css`, function () {
    return gulp.src([
        `styles/**/*.css`,
        `!styles/reset.css`
    ])
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
});

// Transpile & Minify JS
gulp.task(`scripts`, function () {
    return gulp.src(`js/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write(`.`))
        .pipe(gulp.dest(`prod/js`))
        .pipe(browserSync.stream()); // Reload browser after JS changes
});

// Minify CSS
gulp.task(`styles`, function () {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS({ compatibility: `ie8` }))
        .pipe(gulp.dest(`prod/styles`))
        .pipe(browserSync.stream()); // Reload browser after CSS changes
});

// Minify HTML
gulp.task(`html`, function () {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod`))
        .pipe(browserSync.stream()); // Reload browser after HTML changes
});

// Copy Images (No Compression)
gulp.task(`images`, function () {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`prod/img`));
});

// Copy JSON files
gulp.task(`json`, function () {
    return gulp.src(`json/**/*.json`)
        .pipe(gulp.dest(`prod/json`));
});

// Serve & Watch Task with Browser Sync
gulp.task(`serve`, function () {
    browserSync.init({
        server: { baseDir: `.` }, // Serve from project root
        notify: true,
        reloadDelay: 50
    });

    gulp.watch(`js/**/*.js`, gulp.series(`lint-js`, `scripts`));
    gulp.watch(`styles/**/*.css`, gulp.series(`lint-css`, `styles`));
    gulp.watch(`index.html`, gulp.series(`html`));
    gulp.watch(`json/**/*.json`, gulp.series(`json`));
});

// Default Task (Runs Development Workflow)
gulp.task(`default`, gulp.series(`lint-js`, `lint-css`, `serve`));

// Production Build Task
gulp.task(`build`, gulp.series(`html`, `styles`, `scripts`, `images`, `json`));
