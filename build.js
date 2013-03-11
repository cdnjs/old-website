RegExp.prototype.execAll = function(string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        var matchArray = [];
        for (i in match) {
            if (parseInt(i) == i) {
                matchArray.push(match[i]);
            }
        }
        matches.push(matchArray);
    }
    return matches;
};

var _ = require('underscore');
var glob = require('glob');
var fs = require('fs');
var natcompare = require('./natcompare.js');
var packages = fs.readFileSync('packages.json', 'utf8');
packages = JSON.parse(packages).packages;

// options is optional
glob("../cdnjs/ajax/libs/**/*.*", {}, function (er, files) {
  var filesStr = files.join('\n');

  _.each(packages, function(package) {
    var re = new RegExp("^\.\.\/cdnjs\/ajax\/libs\/" +package.name+ "\/(.*?)\/(.*?)$","gm");
    var packageFiles = re.execAll(filesStr);

    packageFiles.sort(function (a, b) {
      return natcompare.compare(a[1].toString(), b[1].toString());
    });

    package.files = packageFiles.reverse();
  });
  var indexTemplate = fs.readFileSync('index.template', 'utf8');

var indexPage = _.template(indexTemplate, {packages: packages});
fs.writeFileSync('index.html', indexPage, 'utf8');
});




