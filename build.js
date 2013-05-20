var superagent = require('superagent');
var _ = require('underscore');
var fs = require('fs');
var http = require('http');
var htmlMinifier = require('html-minifier');

superagent.get('https://s3.amazonaws.com/cdnjs-artifacts//packages.json?' + new Date().getTime(), function(res, textStatus, xhr){
  var packages = res.body.packages;
  var indexTemplate = fs.readFileSync('index.template', 'utf8');
  var indexPage = _.template(indexTemplate, {packages: packages});

  var htmlCompressionOptions = {
  	removeComments: true,
  	collapseBooleanAttributes: true,
  	collapseWhitespace: true,
  };

  indexPage = htmlMinifier.minify(indexPage, htmlCompressionOptions);

  fs.writeFileSync('index.html', indexPage, 'utf8');
  fs.writeFileSync('packages.json', JSON.stringify(res.body, null, 4), 'utf8');
  fs.writeFileSync('packages.min.json', JSON.stringify(res.body), 'utf8');
});

// I was rushing below r0fl

var file = fs.createWriteStream("rss.xml");
var request = http.get("http://s3.amazonaws.com/cdnjs-artifacts//rss", function(response) {
  response.pipe(file);
});



var file2 = fs.createWriteStream("atom.xml");
var request2 = http.get("http://s3.amazonaws.com/cdnjs-artifacts//rss", function(response) {
  response.pipe(file2);
});





