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
                if (err) throw err;

                // if successful, return the new user
                return done(null, newUser);
            })
          }

        })
      })

    })
)


passport.serializeUser(function(user, done) {
  // for the time being tou can serialize the user 
  // object {accessToken: accessToken, profile: profile }
  // In the real app you might be storing on the id like user.profile.id 
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // If you are storing the whole user on session we can just pass to the done method, 
  // But if you are storing the user id you need to query your db and get the user 
  //object and pass to done() 
  done(null, user);
});



module.exports = passport