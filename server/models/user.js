var util = require('util')
  , async = require('async')
  , mongoose = require('../utils/mongoose')
  , Schema = mongoose.Schema


var schema = new Schema({
  username: {
    type: String
  , unique: true
  , required: true
  }
, password: {
    type: String
  , required: true
  }
, created: {
    type: Date
  , default: Date.now
  }
})

exports.User = mongoose.model('User', schema)