var util = require('util')
  , async = require('async')
  , util = require('util')
  , mongoose = require('../utils/mongoose')
  , Schema = mongoose.Schema


var userSchema = new Schema({
  github: {
    id: {
      type: Number
    , required: true
    , unique: true
    }
  , username: {
      type: String
    , required: true
    , unique: true
    }
  , displayName: {
      type: String
    , required: false
    }
  , email: {
      type: String
    , required: true
    }
  }
})


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
