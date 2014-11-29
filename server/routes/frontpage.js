var path = require('path');
var User = require('../models').User;
var Document = require('../models').Document;
var ObjectId = require('mongoose').Types.ObjectId; 

exports.get = function(req, res) {

	/*var user = new User({
      firstName: "Sergey",
      lastName: "Davydovsky",
      email: "electron931@gmail.com",
    	userName: "electron",
    	password: "12345"
    });

  user.save(function (err, user) {
	  if (err) return console.error(err);
	  console.log('user saved');
	});*/

  /*var document = new Document({
    name: "Hobbit.pdf",
    link: "Hobbit.pdf"
  });
  

  document.save(function (err, document) {
    if (err) return console.error(err);
    console.log('document saved');
  });*/



  /*Document.findOne({"name": "Hobbit.pdf"}, function(err, document) {
    if (err) return console.error(err);
    User.findOne({userName: "electron"}, function(err, user) {
      if (err) return console.error(err);
      //console.log(user);
      user.documents.push(document.id);
      user.save(function (err, user) {
        if (err) return console.error(err);
        console.log('user saved');
      });
    });
  })*/
  


  //get all documents for the user
  /*User.findOne({userName: "electron"}, function(err, user) {
    if (err) return console.error(err);
    if (user.documents.length > 0) {
      for (var i = 0; i < user.documents.length; i++) {
        Document.findOne({"_id": user.documents[i]}, function(err, document) {
          if (err) return console.error(err);
          console.log(document);
        });
      }
    }
  });*/


  res.redirect('auth')

}