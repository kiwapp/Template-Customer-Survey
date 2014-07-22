var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    express    = require('express'),
    path       = require('path'),
    tinylr     = require('tiny-lr'),
    openB      = require("gulp-open"),
    concat     = require("gulp-concat"),
    partials   = require('gulp-partial-to-script'),
    fs         = require('fs'),
    es         = require('event-stream'),
    livereload = require('gulp-livereload'),
    // minifyHTML = require('gulp-minify-html'),
    // uglify     = require('gulp-uglify'),
    archiver   = require('archiver'),
    server     = tinylr();
    // convert    = require('gulp-convert');

// Open a file and return a JSON
var readJson = function readJson(file) {
  var src = fs.readFileSync(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    return data;
  });
  return JSON.parse(src);
};

// Default task : Open url, lauch server, livereaload
gulp.task('default',['assets','vendor','templates','scripts','styles','i18n'], function() {

  // Open Google Chrome @ localhost:8080
  gulp.src('./build/index.html')
    .pipe(openB("",{
      app:"google-chrome",
      // app:"/usr/lib/chromium/chromium",
      url: "http://localhost:8080/build/"
   }));

    var app = express();
    app.use(express.static(path.resolve('./')));
    app.listen(8080, function() {
      gutil.log('Listening on', 8080);
    });

    server.listen(35729, function (err) {
      if (err) {
        return console.log(err);
      }

      gulp.watch(["./src/js/**/*","./i18n/*"], ["scripts"]);
      gulp.watch(["./src/layout/**/*","./src/partials/**/*"], ["templates"]);
      gulp.watch("./src/styles/*", ["styles"]);
      gulp.watch("./src/vendor/**/*", ["vendor"]);
      gulp.watch("./i18n/**/*.yml", ["i18n"]);
    });

});

// Build my css
gulp.task('styles', function() {
  gulp.src('./src/styles/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./build/styles/'))
    .pipe(livereload(server));
});

// Build my css
gulp.task('assets', function() {
  gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./build/assets/'));
  gulp.src('./src/assets/favicon.png')
    .pipe(gulp.dest('./build/'));
});

// Move your public directory to build
gulp.task('public', function() {
    gulp.src('./src/public/**/*')
        .pipe(gulp.dest('./build/public/'));
});

// Concatenate your partials and append them to index.html
gulp.task('templates', function() {
  // Thanks to https://github.com/gulpjs/gulp/issues/82. Without es.concat, we have to do CTRL S to times to have the valid view.
  return es.concat(
    gulp.src('./src/partials/**/*.html')
      // .pipe(minifyHTML({spare: true}))
      .pipe(partials())
      .pipe(concat('templates.html'))
      .pipe(gulp.dest('./build'))
  ).on("end", function() {
    gulp.src([
      './src/layout/header.html',
      './src/layout/body.html',
      './build/templates.html',
      './src/layout/footer.html',
    ])
      .pipe(concat('index.html'))
      .pipe(gulp.dest('./build'))
      .pipe(livereload(server));
  });
});

// Build your vendors
gulp.task('vendor', function(){

  var bowerDep = './' + readJson('./.bowerrc').directory;

  return es.concat(
    gulp.src([
      bowerDep + '/jquery/dist/jquery.js',
      bowerDep + '/lodash/dist/lodash.js',
      bowerDep + '/backbone/backbone.js',
      bowerDep + '/momentjs/moment.js',
      bowerDep + '/kiwapp/kiwapp.build.js'
    ])
      .pipe(concat("vendor.min.js"))
      // .pipe(gutil.env.type === 'prod' ? uglify() : gutil.noop())
      .pipe(gulp.dest('build/js')),
    gulp.src(bowerDep + '/normalize-css/normalize.css')
      .pipe(gulp.dest('build/styles'))
  );

});

// Concatenate your app and build an app.js
gulp.task('scripts', function(){
  gulp.src([
      './src/js/bootstrap.js',
      './src/js/models/**/*.js',
      './src/js/collections/**/*.js',
      './src/js/views/**/*.js',
      './src/js/routers/*.js',
      './src/js/app.js',
    ])
    .pipe(concat('app.js'))
    // .pipe(gutil.env.type === 'prod' ? uglify() : gutil.noop())
    .pipe(gulp.dest('./build/js'))
    .pipe(livereload(server));
});

// Update the app's manifest
gulp.task('manifest',function() {

    fs.readFile('./src/manifest.json', function(err, data) {

        if(err) {
            throw new Error("No manifest found, you must create one before we prod");
        }

        data = JSON.parse(data);
        var version = data.app_info.codename.split(".").filter(Number);

        if(version[1] < 9) {
            version[1]++;
        }else{
            version[1] = 0;
            version[0]++;
        }

        data.app_info.codename = version.join(".");
        fs.writeFile('./src/manifest.json', JSON.stringify(data));
        fs.writeFile('./build/manifest.json', JSON.stringify(data));

    });
});

// Create the app's zip
gulp.task('zip', function() {

    var output = fs.createWriteStream('./../prod.zip');
    var archive = archiver('zip');
    output.on('close', function() {
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);
    archive.bulk([{ expand: true, cwd: 'build/', src: ['**'] }]);

    archive.finalize(function(err, bytes) {
        if (err) {
            throw err;
        }
        console.log(bytes + ' total bytes');
    });
});

// Create our application in order to deploy it
gulp.task('prod',['env','assets','templates','vendor','scripts','styles','manifest','i18n'], function() {
    gulp.run("zip");
    gulp.run("doc");
});

// Set the environement to production
gulp.task('env', function(){
    gutil.env.type = 'prod';
});

// Generate your documentation using docker
gulp.task('doc', function(){
  // var spawn = require('child_process').spawn;
  // spawn('docker', ['-i','./src','-x','vendor','-n'], {stdio: 'inherit'});
});

// Create your i18n file from yaml
gulp.task("i18n", function() {
    // gulp.src('./i18n/*.yml')
    //     .pipe(concat('languages.yml'))
    //     .pipe(convert({
    //         from: "yml",
    //         to: "json"
    //     }))
    //     .pipe(gulp.dest("./i18n/"));
});