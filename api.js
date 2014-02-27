var fs = require('fs');


var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});
var port = process.env.PORT || 5000;

app.listen(port);