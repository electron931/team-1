var path = require('path')
  , User = require('../models').User
  , HttpError = require('../utils/error').HttpError
  , AuthError = require('../models').AuthError


exports.get = function(req, res) {
  res.sendFile(path.join(__dirname, '../../views/auth.html'))
}


exports.login = function(req, res, next) {
  var username = req.body.username
  var password = req.body.password

  User.authorize(username, password, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message))
      } else {
        return next(err)
      }
    }

    req.session.user = user.id
    res.redirect('/dashboard')
  })

}


exports.signup = function(req, res, next) {
  var firstName = req.body.firstName
    , lastName = req.body.lastName
    , email = req.body.email
    , username = req.body.username
    , password = req.body.password

  var user = new User ({
    firstName: firstName
  , lastName: lastName
  , email: email
  , username: username
  , password: password
  })

  user.save(function(err) {
    if (err) return next(err)
    
    req.session.user = user.id
    res.redirect('/dashboard')
  })
}


exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect('/auth')
}