(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cdnjs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n    <tr class=\"version\">\n        <td class=\"versionlabel\">";
  if (stack1 = helpers.version) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.version; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n    ";
  stack1 = helpers.each.call(depth0, depth0.files, {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0, depth1),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data,depth1,depth2) {
  
  var buffer = "", stack1;
  buffer += "\n        <tr class=\"library\">\n            <td>\n                <p>//cdnjs.cloudflare.com/ajax/libs/"
    + escapeExpression(((stack1 = depth2.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression(((stack1 = depth1.version),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</p>\n            </td>\n        </tr>\n    ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.assets, {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
})();