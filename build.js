var Hipchat = require('node-hipchat');
var argv = require('minimist')(process.argv.slice(2));
var superagent = require('superagent');
var _ = require('underscore');
var fs = require('fs');
var http = require('http');
var htmlMinifier = require('html-minifier');
var uglifyJs = require('uglify-js');

console.log('Run `node build.js --dev --nolibs` for a fast dev build');

var HC = new Hipchat(process.env.HIPCHAT);
var hipchat = {
  message: function(color, message) {
    if (process.env.HIPCHAT) {
      var params = {
        room: 165440,
        from: 'Website Build',
        message: message,
        color: color,
        notify: 0
      };
      HC.postMessage(params, function(data) {});
    } else {
      console.log('No Hipchat API Key');
    }
  }
};
hipchat.message('Gray', 'Building website');

function generateIndexPage(indexTemplate, packages) {
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
}

function generateIndexPageJS() {
  var result = uglifyJs.minify(['cdnjs.handlebars.js', 'index.js']);
  fs.writeFileSync('min.js', result.code, 'utf8');
}

function generateSite(packages) {
  var indexTemplate = fs.readFileSync('index.template', 'utf8');
  generateIndexPage(indexTemplate, packages);
  generateIndexPageJS();
  makeLibraryPages(packages, indexTemplate);
}

if(argv.dev) {
  console.log('Generating dev build of website...');
  var packagesJson = fs.readFileSync('packages.json', 'utf8');
  var packages = JSON.parse(packagesJson).packages;
  generateSite(packages);
} else {
  console.log('Get packages.json');
  var packagesurl = 'https://s3.amazonaws.com/cdnjs-artifacts/packages.json?' + new Date().getTime();

  superagent.get(packagesurl, function(res, textStatus, xhr){
    console.log('Got packages.json');

    generateSite(res.body.packages);

    fs.writeFileSync('packages.json', JSON.stringify(res.body, null, 4), 'utf8');
    fs.writeFileSync('packages.min.json', JSON.stringify(res.body), 'utf8');
  });
}

function makeLibraryPages(packages, indexTemplate) {
  if(argv.nolibs) return console.log('not compiling libs due to command line params...');

  var packageTemplate = fs.readFileSync('package.template.html', 'utf8');
  _.each(packages, function(package) {
    if(!fs.existsSync('libraries/' + package.name)) {
      fs.mkdirSync('libraries/' + package.name);
    }
    var packageFile = _.template(packageTemplate, {package: package});
    var packagePage = _.template(indexTemplate, {page: packageFile, package: package});

    fs.writeFileSync('libraries/' + package.name + '/index.html', packagePage, 'utf8');
  });
  console.log('Success!');
  hipchat.message('green', 'Website built successfully, deploying now');
}

if(!argv.dev) {
  // I was rushing below r0fl
  var file = fs.createWriteStream("rss.xml");
  var request = http.get("http://s3.amazonaws.com/cdnjs-artifacts/rss", function(response) {
    response.pipe(file);
  });

  var file2 = fs.createWriteStream("atom.xml");
  var request2 = http.get("http://s3.amazonaws.com/cdnjs-artifacts/rss", function(response) {
    response.pipe(file2);
  });
} else {
  console.log('not generating rss & xml due to command line params...');
}