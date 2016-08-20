var router = require('express').Router();

var jwt = require('jsonwebtoken');
var secret = require('../config/tokens').secret;

var authController = require('../controllers/authentications');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({
    message: "Unauthorised"
  });

  var token = req.headers.authorization.replace('Bearer ','');


  jwt.verify(token, secret, function(err, payload){
    if(err || !payload) return res.status(401).json({ message:"Unauthorised"});
    req.user = payload;
    next();
  });
}

router.post('/register', authController.register); 
router.post('/login', authController.login);

module.exports = router;