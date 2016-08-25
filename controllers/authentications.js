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

function login(req, res){
  User.findOne({email: req.body.email}, function(err, user){
    if(err) res.send(500).json(err);
    if(!user || !user.validatePassword(req.body.password)){
      return res.status(401).json({message: "Mmmm..Something went wrong please check your log in details and try again"})
    }

    var payload = { _id: user._id, username: user.username};
    var token = jwt.sign(payload, secret, { expiresIn: 60*60*1});

    return res.status(200).json({ 
      message: "Welcome to Empire you have sucessfully logged in!",
      token: token
    });
  })
};

function show(req, res){
  console.log('looking for user')
  console.log(req.body.email)
  User.findOne({email: req.body.email}, function(err, user){
    if(err) return res.status(500).json(err);

    if(!user) return res.status(404).json({message: 'Could not find user'});

    return res.status(200).json(user);
  });
}

module.exports = {
  register: register,
  login: login,
  show: show
};