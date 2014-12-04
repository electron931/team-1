var path = require('path')
  , User = require('../models').User
  , Document = require('../models').Document
  , HttpError = require('../utils/error').HttpError
  , AuthError = require('../models').AuthError
  , fs = require('fs')



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
    console.log(docId)

    Document.findById(docId).remove(function(err) {
      if (err) return next(err)

      res.end('ok')
    })
  }

}

//rewrite
exports.loadDocument = function (req, res, next) {
  var docContent = getDocument(req.body.docId, req)
  console.log('load')
  console.log(docContent)
  var docObj = {
    value: docContent
  }

  var docJSON = JSON.stringify(docObj)
  
  if (docJSON != null) {
    //console.log(docJSON)
    res.end(docJSON)
  }
  else {
    console.log('nothing');
    res.end()
  }

}


exports.saveDocument = function (req, res, next) {
  console.log('save')
  console.log(req.body)
  var docId = req.body.docId
  var docContent = req.body.docContent

  if (docId) {

    //rewrite using async
    Document.findById(docId, function(err, doc) {
      if (err) return next(err)

      doc.modificationDate = new Date()

      doc.save(function (err, document) {
        if (err) return next(err)
        

        if (!fs.existsSync(__dirname + '/../savedDocuments')) {
          fs.mkdirSync(__dirname + '/../savedDocuments')
          if (!fs.existsSync(__dirname + '/../savedDocuments/' + req.session.passport.user._id)) {
            fs.mkdirSync(__dirname + '/../savedDocuments/' + req.session.passport.user._id)
          }
        }

        fs.writeFile( __dirname + '/../savedDocuments/' 
          + req.session.passport.user._id + '/' + doc._id, docContent, function(err) {
            if (err) return next(err)
              
            res.end('ok')   //laconic answer, rewrite
        } )

      })

    })
  }

}




function getDocument(docId, req) {
  if (!fs.existsSync(__dirname + '/../savedDocuments')) {
    fs.mkdirSync(__dirname + '/../savedDocuments')
    if (!fs.existsSync(__dirname + '/../savedDocuments/' + req.session.passport.user._id)) {
      fs.mkdirSync(__dirname + '/../savedDocuments/' + req.session.passport.user._id)
    }
  }


  var pathToDoc = __dirname + '/../savedDocuments/' + req.session.passport.user._id + '/' + docId

  if (fs.existsSync(pathToDoc)) {
    return fs.readFileSync(pathToDoc, "utf8")
  }
  else {
    return null
  }

}