var User = require('./models').User
  , passport = require('passport')
  , GithubStrategy = require('passport-github').Strategy
  , oauth = require('../config/oauth')


passport.use(new GithubStrategy({
    clientID: oauth.github.clientID
  , clientSecret: oauth.github.clientSecret
  , callbackURL: oauth.github.callbackURL
  }
  , function (accessToken, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
        User.findOne({ 'github.id' : profile.id }, function(err, user) {
          if (err) return done(err)

          if (user) {
            return done(null, user) // user found, return that user
          } 
          else {
            // if there is no user found with that github id, create them
            var newUser = new User()
            newUser.github.id = profile.id
            newUser.github.username = profile.username
            newUser.github.displayName = profile.displayName
            newUser.github.email = profile.emails[0].value

            // save our user to the database
            newUser.save(function(err) {
                if (err) throw err

                // if successful, return the new user
                return done(null, newUser)
            })
          }

        })
      })

    })
)


passport.serializeUser(function(user, done) {
  done(null, user)
})


passport.deserializeUser(function(user, done) {
  User.findOne({ 'github.id' : user.github.id }, function(err, user) {
    if (err) return done(err)

    done(null, user)
  })
})



module.exports = passport