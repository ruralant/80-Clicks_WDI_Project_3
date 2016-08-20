var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = require('../config/tokens').secret;

//NOTE TOKENS CURRENTLY SET TO 1hr

function register(req, res){

  User.create(req.body, function(err, user){

    if(err) return res.status(400).json(err);

    var payload = { _id: user._id, username: user.username};
    var token = jwt.sign(payload, secret, { expiresIn: 60*60*1});

    return res.status(200).json({message: "You have succesfully registered - let's play",
      token: token
    });
  })
};

module.exports = {
  register: register
};