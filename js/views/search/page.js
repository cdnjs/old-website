define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/search/page.html',
  'text!templates/search/table.html',
  'datatables',
  'collections/packages'
], function($, _, Backbone, dashboardPageTemplate, tableTemplate, datatables, PackagesCollection){
  var DashboardPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      var that = this;
		  var packagesCollection = new PackagesCollection;
      packagesCollection.fetch({
        success: function (packages) {
          that.$el.find('.packages-table-container').html(_.template(tableTemplate, {packages: packages.models}));
          $('#example').dataTable({
            "sDom": "<'row'<'span12'f>r>t<'row'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
             "bPaginate": false,
            "oLanguage": {
              "sLengthMenu": "_MENU_ records per page"
            }
          });
        }

      });
      $(this.el).html(dashboardPageTemplate);
   
    }
  });
  return DashboardPage;
});
