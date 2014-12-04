var path = require('path')
  , passport = require('../passport')



exports.login = function(req, res) {
  res.sendFile(path.join(__dirname, '../../views/auth.html'))
}


exports.githubAuth = passport.authenticate('github')

exports.githubSuccess = function(req, res, next) {
    res.end('Login Success');
}

exports.githubError = function(req, res, next) {
    res.end('Login Failed');
}


exports.githubCallback = passport.authenticate('github',
 { successRedirect: '/auth/github/success', failureRedirect: '/auth/github/error'})



exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect('/auth/login')
}
