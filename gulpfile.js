var gulp = require("gulp");
var scss = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var nodemon = require("gulp-nodemon");
var browserSync = require("browser-sync");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");

var PATH = {
    HTML: "./src",
    ASSETS: {
      IMAGES: "./src/assets/images",
      STYLES: "./src/assets/styles",
      SCRIPT: "./src/assets/script"
    }
  },
  DEST_PATH = {
    HTML: "./dist",
    ASSETS: {
      IMAGES: "./dist/assets/images",
      STYLES: "./dist/assets/styles",
      SCRIPT: "./dist/assets/script"
    }
  };

gulp.task(
  "scss:compile",
  () =>
    new Promise(resolve => {
      var options = {
        outputStyle: "nested",
        indentType: "space",
        indentWidth: 4,
        precision: 8,
        sourceComments: true
      };

      gulp
        .src(PATH.ASSETS.STYLES + "/*.scss")
        .pipe(sourcemaps.init())
        .pipe(scss(options))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DEST_PATH.ASSETS.STYLES))
        .pipe(browserSync.reload({ stream: true }));

      resolve();
    })
);

gulp.task(
  "html",
  () =>
    new Promise(resolve => {
      gulp
        .src(PATH.HTML + "/index.html")
        .pipe(gulp.dest(DEST_PATH.HTML))
        .pipe(browserSync.reload({ stream: true }));

      resolve();
    })
);

gulp.task(
  "nodemon:start",
  () =>
    new Promise(resolve => {
      nodemon({
        script: "app.js",
        watch: "app"
      });

      resolve();
    })
);

gulp.task("script:build", () => {
  return new Promise(resolve => {
    gulp
      .src(PATH.ASSETS.SCRIPT + "/*.js")
      .pipe(concat("common.js"))
      .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
      .pipe(
        babel({
          presets: ["es2015"]
        })
      )
      .pipe(uglify())
      .pipe(rename("common.min.js"))
      .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
      .pipe(browserSync.reload({ stream: true }));
    resolve();
  });
});

gulp.task(
  "imagemin",
  () =>
    new Promise(resolve => {
      gulp
        .src(PATH.ASSETS.IMAGES + "/*.*")
        .pipe(
          imagemin([
            imagemin.gifsicle({ interlaced: false }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
            })
          ])
        )
        .pipe(gulp.dest(DEST_PATH.ASSETS.IMAGES))
        .pipe(browserSync.reload({ stream: true }));

      resolve();
    })
);

gulp.task(
  "watch",
  () =>
    new Promise(resolve => {
      gulp.watch(PATH.HTML + "/**/*.html", gulp.series(["html"]));
      gulp.watch(
        PATH.ASSETS.STYLES + "/**/*.scss",
        gulp.series(["scss:compile"])
      );
      gulp.watch(
        PATH.ASSETS.SCRIPT + "/**/*.js",
        gulp.series(["script:build"])
      );
      gulp.watch(PATH.ASSETS.IMAGES + "/**/*.*", gulp.series(["imagemin"]));

      resolve();
    })
);

gulp.task(
  "browserSync",
  () =>
    new Promise(resolve => {
      browserSync.init(null, {
        proxy: "http://localhost:8005",
        port: 8006
      });

      resolve();
    })
);

gulp.task(
  "clean",
  () =>
    new Promise(resolve => {
      del.sync(DEST_PATH.HTML);
      resolve();
    })
);

gulp.task(
  "default",
  gulp.series([
    "clean",
    "scss:compile",
    "html",
    "script:build",
    "imagemin",
    "nodemon:start",
    "browserSync",
    "watch"
  ])
);
