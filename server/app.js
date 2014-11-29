var express = require('express')
  , path = require('path')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , HttpError = require('./utils/error').HttpError
  , expressSession = require('express-session')
  , app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'views')));

app.use(expressSession({secret: 'mySecretKey'}));

app.use(require('./middleware/sendHttpError'))

require('./routes')(app)     //main routes for app


/// catch 404 and forwarding to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})*/

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    next(404);
});

// error handler
app.use(function(err, req, res, next) {
    if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            throw err;
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});


module.exports = app
