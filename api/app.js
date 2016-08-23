var express = require('express');
var app = express();

var environment = app.get('env');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var ejs = require('ejs');

var port = process.env.PORT || 3000;
var routes = require('./config/routes');
var databaseUri = require('./config/db')(environment);

mongoose.connect(databaseUri);

if('test' !== app.get('env')){
  app.use(require('morgan')('dev'));
}

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/api', routes);

app.get('/images/tank-icon/:color/:tanks', function(req, res) {
  ejs.renderFile('./views/tank-icon.ejs', { color: "#" + req.params.color, tanks: req.params.tanks }, function(err, svg) {
    if(err) res.status(500).json(err);

    res.set('Content-Type', 'image/svg+xml')
      .status(200)
      .send(svg);
  });
});

app.listen(port, function(){
  console.log("Yeah! Express is listening on port " + port);
});

module.exports = app;