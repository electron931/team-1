var util = require('util')
  , async = require('async')
  , crypto = require('crypto')
  , util = require('util')
  , mongoose = require('../utils/mongoose')
  , Schema = mongoose.Schema


var userSchema = new Schema({
  firstName: {
    type: String
  , required: true
  }
, lastName: {
    type: String
  , required: true
  }
, email: {
    type: String
  , unique: true
  , required: true
}
, username: {
    type: String
  , unique: true
  , required: true
  }
, hashedPassword: {
    type: String
  , required: true
  }
, salt: {
    type: String
  , required: true
  }
})


userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

userSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password
        this.salt = Math.random() + ''
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function() { return this._plainPassword })


userSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword
}

userSchema.statics.authorize = function(username, password, callback) {
  var User = this

  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback)
    },
    function(user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user)
        }
        else {
          callback(new AuthError('Incorrect username or password'))       //incorrect password
        }
      }
      else {
        callback(new AuthError('Incorrect username or password'))
      }
    }
  ], callback)
}


var documentSchema = new Schema({
  name: {
    type: String
  , required: true
  }
, creationDate: {
    type: Date
  , default: Date.now
  }
, modificationDate: {
    type: Date
  }
, creator: {
    type: Schema.ObjectId
  , ref: "User"
  }
})

documentSchema.statics.getUserDocuments = function(userId, callback) {
    var Document = this

    Document.find({ creator: userId }, function(err, documents) {
      if (err) return callback(err)
      return callback(null, documents)
    })
}


exports.User = mongoose.model('User', userSchema)
exports.Document = mongoose.model('Document', documentSchema)


function AuthError(message) {
    Error.apply(this, arguments)
    Error.captureStackTrace(this, AuthError)

    this.message = message
}

util.inherits(AuthError, Error)

AuthError.prototype.name = 'AuthError'

exports.AuthError = AuthError