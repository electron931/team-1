var path = require('path')
  , url = require('url')
  , fs = require('fs')


exports.get = function(req, res, next) {
  var urlParsed = url.parse(req.url, true)

  if (urlParsed.query.name) {
    var themePath = 'libs/codemirror/theme/' + urlParsed.query.name

    fs.readFile(themePath + '.css', 'utf8',  function (err, data) {
      if (err) return next(err)

      res.write(JSON.stringify(data))
      res.end()
    })
  }
  else {
    fs.readdir('libs/codemirror/theme/', function (err, files) {
      if (err) return next(err)

      res.write(JSON.stringify(files))
      res.end()
    })
  }

}

