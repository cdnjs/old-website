var superagent = require('superagent');

var recieved_json = function (json) {
  console.log("success");
};



superagent.get('s3.amazonaws.com/cdnjs-artifacts//packages.json' + new Date().getTime(), function(data, textStatus, xhr){
  recieved_json(data.body);
});
