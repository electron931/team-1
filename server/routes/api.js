var path = require('path')
  , User = require('../models').User
  , Document = require('../models').Document
  , HttpError = require('../utils/error').HttpError
  , AuthError = require('../models').AuthError
  , fs = require('fs')



exports.getUserDocuments = function (req, res, next) {
  if (!req.session.user) {
    return null
  }

  Document.getUserDocuments(req.session.user, function (err, documents) {
    if (err) return console.log(err)
    res.end(JSON.stringify(documents))
  })
}



exports.createDocument = function (req, res, next) {
  if (!req.session.user) {
    return null
  }

  var document = new Document ({
    name: '' + Math.random()      //need to generate something else. rewrite
  , creator: req.session.user
  })

  document.save(function (err, document) {
    if (err) return console.log(err)
    //res.end(JSON.stringify(document))
    console.log(document)
    res.redirect('/editor#' + document._id)
  })

}


exports.getCurrentUser = function (req, res, next) {
  if (!req.session.user) {
    return null
  }

  User.findById(req.session.user, function (err, user){
    if (err) return console.log(err)
    res.end(JSON.stringify(user))
  })
  
}


exports.deleteDocument = function (req, res, next) {
  if (!req.session.user) {
    return null
  }

  var docId = req.body.docId

  if (docId) {
    console.log(docId)

    Document.findById(docId).remove(function(err) {
      if (err) return console.log(err)

      res.end('ok')
    })
  }

}


exports.saveDocument = function (req, res, next) {
  if (!req.session.user) {
    return null
  }
  console.log(req.body)
  var docId = req.body.docId
  var docContent = req.body.docContent

  if (docId) {

    //rewrite using async
    Document.findById(docId, function(err, doc) {
      if (err) return console.log(err)

      doc.modificationDate = new Date()

      doc.save(function (err, document) {
        if (err) return console.log(err)
        

        if (!fs.existsSync(__dirname + '/../savedDocuments')) {
          fs.mkdirSync(__dirname + '/../savedDocuments')
          if (!fs.existsSync(__dirname + '/../savedDocuments/' + req.session.user)) {
            fs.mkdirSync(__dirname + '/../savedDocuments/' + req.session.user)
          }
        }

        fs.writeFile( __dirname + '/../savedDocuments/' 
          + req.session.user + '/' + doc.name, docContent, function(err) {
            if (err) return console.log(err)

            res.end('ok')   //laconic answer, rewrite
        } )

      })

    })
  }

}
