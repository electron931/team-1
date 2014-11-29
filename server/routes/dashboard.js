var path = require('path')
  , User = require('../models').User
  , HttpError = require('../utils/error').HttpError
  , AuthError = require('../models').AuthError



exports.get = function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../views/dashboard.html'))
}

