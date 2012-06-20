define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var packagesCollection = Backbone.Collection.extend({
    url: 'packages.json',
    initialize: function(){

    },
    parse: function(resp) {

      return resp.packages;
    }

  });

  return  packagesCollection;
});
