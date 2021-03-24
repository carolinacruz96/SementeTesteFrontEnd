var     gulp = require('gulp'),
        sass = require('gulp-sass'),
        sassLint = require('gulp-sass-lint'),
        sourcemaps = require('gulp-sourcemaps'),
        autoprefixer = require('gulp-autoprefixer'),
        concat = require('gulp-concat'),
        browserSync = require('browser-sync').create(),
        reload = browserSync.reload;

// transport html
function html() {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'));
}

// transport images
function images() {
    return gulp.src('./src/images/**/*.+(png|jpg|gif|svg|ico|xml|txt|json)')
    .pipe(gulp.dest('./dist/images/'));
}

// transport js
function js() {
    return gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js/'));
}

// compile scss into css
function style() {
    // 1. where is myscss files
    return gulp.src([
        // setup
        './src/styles/**/*.scss',
    ])
    // 2. sass linting
        .pipe(sassLint({
            rules: {
                'no-extends': 1,
                'no-color-keywords': 2,
                'class-name-format': [
                    1,
                    {
                        convention: 'hyphenatedbem'
                    }
                ],
                indentation: [
                    1,
                    {
                        character: 'space',
                        size: 4,
                    }
                ]
            }
        }))
    // 3. concat all scss
        .pipe(concat('styles.scss'))

    // 4. format sass according do sassLint definition
        .pipe(sassLint.format())

    // 5. create sourcemaps for easier debug
        .pipe(sourcemaps.init())

    // 6. pass that file through sass compiler
        .pipe(sass().on('error', sass.logError))

    // 7. apply autoprefixer
        .pipe(autoprefixer('last 2 versions'))

    // 8. where do I save the compiled css
        .pipe(gulp.dest('./dist/styles/'))

    // 9. stream changes to all browsers
        .pipe(browserSync.stream());
}

// watch to recompile and retransport files
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });

    gulp.watch('./src/**/*.html', html);
    gulp.watch('./src/**/*.html').on('change', reload);
    gulp.watch('./src/images/**/*.+(png|jpg|gif|svg|ico|xml|txt|json)', images);
    gulp.watch('./src/images/**/*.+(png|jpg|gif|svg|ico|xml|txt|json)').on('change', reload);
    gulp.watch('./src/**/*.js', js);
    gulp.watch('./src/**/*.js').on('change', reload);
    gulp.watch('./src/styles/**/*.scss', style);
    gulp.watch('./src/js/**/*.js').on('change', reload);
}

exports.html = html;
exports.images = images;
exports.js = js;
exports.style = style;
exports.default = watch;
