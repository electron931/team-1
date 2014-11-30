var path = require('path')
  , User = require('../models').User
  , Document = require('../models').Document
  , HttpError = require('../utils/error').HttpError
  , AuthError = require('../models').AuthError



exports.getUserDocuments = function(req, res, next) {
  if (!req.session.user) {
    return null
  }

  Document.getUserDocuments(req.session.user, function(err, documents) {
    if (err) return console.log(err);
    res.end(JSON.stringify(documents))
  })
}



exports.createDocument = function(req, res, next) {
  if (!req.session.user) {
    return null
  }

  var document = new Document ({
    name: 'Hobbit.txt' + Math.random(),
    link: 'Hobbit.txt' + Math.random(),
    creator: req.session.user
  })

  document.save(function (err, document) {
    if (err) return console.log(err);
    res.end(JSON.stringify(document));
  })

}


exports.getCurrentUser = function(req, res, next) {
  if (!req.session.user) {
    return null
  }

  User.findById(req.session.user, function (err, user){
    if (err) return console.log(err);
    res.end(JSON.stringify(user));
  });
  
}

