var _ = require('underscore');
var fs = require('fs');
var packages = fs.readFileSync('packages.json', 'utf8');
var indexTemplate = fs.readFileSync('index.template', 'utf8');

var indexPage = _.template(indexTemplate, {packages: JSON.parse(packages).packages});
fs.writeFileSync('index.html', indexPage, 'utf8');