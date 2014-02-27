var fs = require('fs');


var express = require('express');
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
	next();
}

app.use(express.bodyParser());
app.use(allowCrossDomain);

app.get('/', function(req, res){
res.setHeader("Expires", new Date(Date.now() + 5 * 60 * 1000).toUTCString());
  res.send('hello world');
});
var port = process.env.PORT || 5000;

app.listen(port);