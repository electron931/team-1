var gulp = require('gulp')
  , gulpIgnore = require('gulp-ignore')
  , concat = require('gulp-concat')
  , autoprefixer = require('gulp-autoprefixer')
  , wrap = require('gulp-wrap')
  , watch = require('gulp-watch')
  , streamqueue = require('streamqueue')
  , karma = require('karma').server
  , uglify = require('gulp-uglify')
  , minifyCSS = require('gulp-minify-css')
  , minifyHTML = require('gulp-minify-html')
  , runSequence = require('run-sequence')
  , env = process.env.NODE_ENV || 'DEV'


gulp.task('config', function () {

  var srcConfig = ''

  console.log('App is running in ' + env + ' environment')

  if (env === 'PROD') {
    srcConfig = './config/prod.json'
  }
  else {
    srcConfig = './config/dev.json'
  }

  gulp
    .src(srcConfig)
    .pipe(concat('current.json'))
    .pipe(gulp.dest('./config'))
})


gulp.task('editor.html', function () {
  streamqueue(
    { objectMode: true }
    , gulp.src('pages/editor/blocks/page/page.html')
    , gulp
      .src('pages/editor/blocks/**/*.html')
      .pipe(gulpIgnore.exclude('**/page.html'))
      .pipe(wrap('<script '
          + 'type="template" '
          + 'id="<%= file.path.replace(/^.*\\/([^/]+)$/, \'$1\') %>">'
          + '<%= file.contents %>'
          + '</script>'
      ))
    , gulp
        .src(
          [ 'libs/codemirror/lib/codemirror.css'
          , 'libs/switchery/dist/switchery.min.css'
          , 'pages/editor/blocks/**/*.css'
          ]
        )
        .pipe(concat('index.css'))
        .pipe(autoprefixer(
          { browsers: ['last 3 versions']
          , cascade: true
          }
        ))
        .pipe(wrap('<style><%= contents %></style>'))
    , gulp
      .src(
        [ 'libs/jquery/dist/jquery.min.js'
        , 'libs/lodash/dist/lodash.min.js'
        , 'libs/codemirror/lib/codemirror.js'
        , 'node_modules/share/webclient/share.uncompressed.js'
        , 'libs/share-codemirror/share-codemirror.js'
        , 'libs/codemirror/mode/javascript/javascript.js'
        , 'libs/switchery/dist/switchery.min.js'
        , 'pages/editor/blocks/page/page.js'
        , 'pages/editor/blocks/**/*.js'
        ]
      )
      .pipe(concat('index.js'))
      .pipe(wrap('<script><%= contents %></script>'))
  )
    .pipe(concat('editor.html'))
    .pipe(gulp.dest('./views'))
})




gulp.task('login.html', function () {
  streamqueue(
    { objectMode: true }
    , gulp
      .src('pages/login/blocks/**/*.html')
    , gulp
        .src(
          [ 'pages/login/blocks/**/*.css' ]
        )
        .pipe(concat('index.css'))
        .pipe(autoprefixer(
          { browsers: ['last 3 versions']
          , cascade: true
          }
        ))
        .pipe(wrap('<style><%= contents %></style>'))
    , gulp
      .src(
        [ 'pages/login/blocks/page/page.js'
        , 'pages/login/blocks/**/*.js'
        ]
      )
      .pipe(concat('index.js'))
      .pipe(wrap('<script><%= contents %></script>'))
  )
    .pipe(concat('login.html'))
    .pipe(gulp.dest('./views'))
})


gulp.task('dashboard.html', function () {
  streamqueue(
    { objectMode: true }
    , gulp
      .src('pages/dashboard/blocks/**/*.html')
    , gulp
        .src(
          [ 'pages/dashboard/blocks/**/*.css' ]
        )
        .pipe(concat('index.css'))
        .pipe(autoprefixer(
          { browsers: ['last 3 versions']
          , cascade: true
          }
        ))
        .pipe(wrap('<style><%= contents %></style>'))
    , gulp
      .src(
        [ 'pages/dashboard/blocks/page/page.js'
        , 'pages/dashboard/blocks/**/*.js'
        ]
      )
      .pipe(concat('index.js'))
      .pipe(wrap('<script><%= contents %></script>'))
  )
    .pipe(concat('dashboard.html'))
    .pipe(gulp.dest('./views'))
})





gulp.task('default', runSequence( 'config', 'login.html', 'dashboard.html', 'editor.html'))

