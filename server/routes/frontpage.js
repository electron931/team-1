var path = require('path')
var User = require('../models/user').User;

exports.get = function(req, res) {

	var user = new User({
    	username: "John",
    	password: "qwerty"
    });

    user.save(function (err, user) {
	  if (err) return console.error(err);
	  console.log('saved');
	});


    res.sendFile(path.join(__dirname, '../../views/index.html'))
    


    


}