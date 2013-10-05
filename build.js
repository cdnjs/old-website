var superagent = require('superagent');
var _ = require('underscore');
var fs = require('fs');
var http = require('http');
var htmlMinifier = require('html-minifier');
var uglifyJs = require('uglify-js');
console.log('Get packages.json')
var packagesurl = 'https://s3.amazonaws.com/cdnjs-artifacts/packages.json?' + new Date().getTime();
console.log(packagesurl);
superagent.get(packagesurl, function(res, textStatus, xhr){
  console.log('Got packages.json')
  var packages = res.body.packages;
  var indexTemplate = fs.readFileSync('index.template', 'utf8');
  var homeTemplate = fs.readFileSync('home.template.html', 'utf8');
  var homePage = _.template(homeTemplate, {packages: packages});
  var indexPage = _.template(indexTemplate, {page: homePage});
  var htmlCompressionOptions = {
  	removeComments: true,
  	collapseBooleanAttributes: true,
  	collapseWhitespace: true,
  };

  indexPage = htmlMinifier.minify(indexPage, htmlCompressionOptions);
  indexPage = indexPage.replace('&nbsp;', ' ');

  fs.writeFileSync('index.html', indexPage, 'utf8');
  fs.writeFileSync('packages.json', JSON.stringify(res.body, null, 4), 'utf8');
  fs.writeFileSync('packages.min.json', JSON.stringify(res.body), 'utf8');

  var result = uglifyJs.minify(['cdnjs.handlebars.js', 'index.js']);
  fs.writeFileSync('min.js', result.code, 'utf8');
  makeLibraryPages(packages, indexTemplate);
});

// I was rushing below r0fl
var file = fs.createWriteStream("rss.xml");
var request = http.get("http://s3.amazonaws.com/cdnjs-artifacts/rss", function(response) {
  response.pipe(file);
});



var file2 = fs.createWriteStream("atom.xml");
var request2 = http.get("http://s3.amazonaws.com/cdnjs-artifacts/rss", function(response) {
  response.pipe(file2);
});



var makeLibraryPages = function(packages, indexTemplate) {
  var packageTemplate = fs.readFileSync('package.template.html', 'utf8');
  _.each(packages, function(package) {
    console.log(package);
    if(!fs.existsSync('libraries/' + package.name)) {
      fs.mkdirSync('libraries/' + package.name);
    }
    var packageFile = _.template(packageTemplate, {package: package});
    var packagePage = _.template(indexTemplate, {page: packageFile});

    fs.writeFileSync('libraries/' + package.name + '/index.html', packagePage, 'utf8');
  })
};
