define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/dashboard/page.html',
  'datatables'
], function($, _, Backbone, dashboardPageTemplate, datatables){
  var DashboardPage = Backbone.View.extend({
    el: '.page',
    render: function () {
		
      $(this.el).html(dashboardPageTemplate);
      $('#example').dataTable( {
          "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
          "sPaginationType": "bootstrap",
          "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
          }
        } );
    }
  });
  return DashboardPage;
});
