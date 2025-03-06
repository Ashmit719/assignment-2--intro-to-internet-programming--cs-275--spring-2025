const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const sourcemaps = require(`gulp-sourcemaps`);
const connect = require(`gulp-connect`);

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
        `styles/**/*.css`, // Include all CSS files
        `!styles/reset.css` // Exclude reset.css (already linted)
    ])
        .pipe(stylelint({
            configFile: `.stylelintrc.json`, // Explicitly use the config file
            reporters: [{ formatter: `string`, console: true }]
        }));
});
// Transpile & Minify JS
gulp.task(`scripts`, function () {
    return gulp.src(`js/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(sourcemaps.write(`.`))
        .pipe(gulp.dest(`prod/js`));
});

// Minify CSS
gulp.task(`styles`, function () {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS({ compatibility: `ie8` }))
        .pipe(gulp.dest(`prod/styles`));
});

// Minify HTML
gulp.task(`html`, function () {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod`));
});

// Copy Images (NO COMPRESSION)
gulp.task(`images`, function () {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`prod/img`));
});
// Copy JSON files to prod/json
gulp.task(`json`, function () {
    return gulp.src(`json/**/*.json`) // Source JSON files
        .pipe(gulp.dest(`prod/json`)); // Destination folder
});
// Watch files and reload browser
gulp.task(`watch`, function () {
    connect.server({ livereload: true });
    gulp.watch(`js/**/*.js`, gulp.series(`lint-js`, `scripts`));
    gulp.watch(`styles/**/*.css`, gulp.series(`lint-css`, `styles`));
    gulp.watch(`index.html`, gulp.series(`html`));
    gulp.watch(`json/**/*.json`, gulp.series(`json`));
});

// Default task for development
gulp.task(`default`, gulp.series(`lint-js`, `lint-css`, `watch`));

// Production build task
gulp.task(`build`, gulp.series(`html`, `styles`, `scripts`, `images`, `json`));
