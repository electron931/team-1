var path = require('path')
  , User = require('../models').User
  , Document = require('../models').Document
  , HttpError = require('../utils/error').HttpError
  , AuthError = require('../models').AuthError
  , fs = require('fs')
  , async = require('async')



exports.getUserDocuments = function (req, res, next) {
  Document.getUserDocuments(req.session.passport.user._id, function (err, documents) {
    if (err) return next(err)
    res.end(JSON.stringify(documents))
  })
}



exports.createDocument = function (req, res, next) {
  var document = new Document ({
    name: '' + Math.random()      //need to generate something else. rewrite
  , creator: req.session.passport.user._id
  })

  document.save(function (err, document) {
    if (err) return next(err)

    res.redirect('/editor#' + document._id)
  })

}


exports.getCurrentUser = function (req, res, next) {
  User.findById(req.session.passport.user._id, function (err, user){
    if (err) return next(err)
    res.end(JSON.stringify(user))
  })
  
}

exports.deleteDocument = function (req, res, next) {
  var docId = req.body.docId

  if (docId) {

    Document.findById(docId).remove(function(err) {
      if (err) return next(err)

        //remove document from disk
        fs.unlink(__dirname + '/../savedDocuments/' + 
          req.session.passport.user._id + '/' + docId, function (err) {

          if (err) return next(err)
          res.end('ok')
        })
      
    })
  }

}


exports.loadDocument = function (req, res, next) {
  var docContent = getDocument(req.body.docId, req)

  var docObj = {
    value: docContent
  }

  var docJSON = JSON.stringify(docObj)
  
  if (docJSON != null) {
    res.end(docJSON)
  }
  else {
    res.end()
  }

}


exports.saveDocument = function (req, res, next) {
  var docId = req.body.docId
  var docContent = req.body.docContent

  if (!docId) {
    res.end()
    return
  }

  async.waterfall([
    function(callback) {
      Document.findById(docId, function(err, doc) {
        if (err) return callback(err)

        callback(null, doc);
      })
    }
  , function(doc, callback) {
      doc.modificationDate = new Date()
      doc.save(function(err, document) {
        if (err) return callback(err)

        createFolderIfNotExists(req)
        callback(null, document)
      })
    }
  , function(document, callback) {
      fs.writeFile( __dirname + '/../savedDocuments/' 
        + req.session.passport.user._id + '/' + document._id, docContent, function(err) {
          if (err) return callback(err)

          callback(null, document)
        })
    }
  ]
  , function (err, result) {
      if (err) return next(err)
      res.end('ok')   //laconic answer, rewrite
  })

}


function createFolderIfNotExists (req) {

  if (!fs.existsSync(__dirname + '/../savedDocuments')) {
    console.log('ha');
    fs.mkdirSync(__dirname + '/../savedDocuments')
    if (!fs.existsSync(__dirname + '/../savedDocuments/' + req.session.passport.user._id)) {
      console.log('la')
      fs.mkdirSync(__dirname + '/../savedDocuments/' + req.session.passport.user._id)
    }
  }

}


function getDocument(docId, req) {
  createFolderIfNotExists(req)

  var pathToDoc = __dirname + '/../savedDocuments/' + req.session.passport.user._id + '/' + docId

  if (fs.existsSync(pathToDoc)) {
    console.log('exists');
    return fs.readFileSync(pathToDoc, "utf8")
  }
  else {
    return null
  }

}