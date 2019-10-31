/* gulp */
var gulp = require('gulp'); // +
var autoprefixer = require('gulp-autoprefixer'); // +
var rename = require('gulp-rename'); // +
var sass = require('gulp-sass'); // +
var cssnano = require('gulp-cssnano'); // +
var uglify = require('gulp-uglifyjs'); // +
var imagemin = require('gulp-imagemin'); // +
var del = require('del'); // +

var browserSync = require('browser-sync');
var concat = require('gulp-concat');



var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');

var include = require('gulp-include');
var open = require('gulp-open');


// style
var sass_input = 'app/sass/**/*.+(scss|sass)'; // .+(scss|sass) .sass
var css_output = 'dist/css';

gulp.task('sass-min', function () {
  return gulp.src(sass_input)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(css_output))
      .pipe(browserSync.reload({stream: true}))
});

gulp.task('sass', function () {
  return gulp.src(sass_input)
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
      .pipe(gulp.dest(css_output))
      .pipe(browserSync.reload({stream: true}))
});

// script

var js_input = 'app/js/*.js';
var js_output = 'dist/js';
var js_output_name = 'app.js';

gulp.task('js', function () {

  return gulp.src(js_input)
      .pipe(include()).on('error', console.log)
      //.pipe(uglify())
      .pipe(concat(js_output_name))
      .pipe(gulp.dest(js_output))
      .pipe(browserSync.reload({stream: true}));

});

gulp.task('js-min', function () {
  return gulp.src(js_input)
      .pipe(include()).on('error', console.log)
      .pipe(uglify())
      .pipe(concat(js_output_name))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(js_output))
      .pipe(browserSync.reload({stream: true}));
});


// browser-syn

var baseDir = 'dist';

gulp.task('browser-sync', function () {

  browserSync({
    server: {
      baseDir: baseDir
    },
    //proxy: 'gulp.loc',
    // отключяем уведомление
    notify: false
  });

});

// img

var images_input = 'app/i/**/*.{jpg,png,svg,gif,ico}';
var images_output = 'dist/i';

gulp.task('image-min', function () {

  return gulp.src(images_input)

      .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
      })))

      .pipe(gulp.dest(images_output))

      .pipe(browserSync.reload({stream: true}));
});

// html

var html_input = 'app/**/*.{htm,html,php}';
var html_output = 'dist/';

gulp.task('html', function () {

  return gulp.src(html_input)

      .pipe(gulp.dest(html_output))

      .pipe(browserSync.reload({stream: true}));
});

// gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function(){
gulp.task('watch', ['browser-sync'], function () {

  gulp.watch(sass_input, ['sass', 'sass-min']);

  gulp.watch(js_input, ['js', 'js-min']);

  gulp.watch(images_input, ['image-min']);

  gulp.watch(html_input, ['html']);

});

// default
gulp.task('default', ['watch']);


