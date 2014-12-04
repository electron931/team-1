var path = require('path')
  , passport = require('../passport')


exports.login = function(req, res) {
  if (req.session.passport && req.session.passport.user && req.session.passport.user._id) {
    res.redirect('/dashboard')
  }
  else {
    res.sendFile(path.join(__dirname, '../../views/auth.html'))
  } 
}

exports.githubAuth = passport.authenticate('github')

exports.githubCallback = passport.authenticate( 'github'
  , { successRedirect: '/dashboard', failureRedirect: '/auth/login?t=error' } )

exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect('/auth/login')
}
