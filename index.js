$('#example').dataTable({
	"sDom": "<'row'<'span12'f>r>t<'row'<'span6'i><'span6'p>>",
	"sPaginationType": "bootstrap",
	 "bPaginate": false,
	"oLanguage": {
	  "sLengthMenu": "_MENU_ records per page"
	}
  });

$('input[readonly]').on('mouseenter', function (event) {
  $(this).select();
});

var packages = null;
var template = null;

$(document).ready(function(){
	$(".btn-version-files").on("click", function(e){
		e.preventDefault();
		var package_name = $(e.currentTarget).attr('package-name');
		if (template == null) {
			template = Handlebars.templates['cdnjs'];
		}
		$("#LAZY_" + package_name.replace('.', '')).html(template(load_versions(package_name)))
		$(this).siblings('.filesandversions').slideToggle(200);
		$(this).siblings('.filesandversions').find('input[readonly]').on('mouseenter', function (event) {
			$(this).select();
		});
	});
	load_packages(true);
});

(function($){
	load_versions = function(package_name) {
		load_packages(false);
		var pkgLength = packages.length;
		for (var i = 0; i < pkgLength; i++) {
			if (packages[i].name == package_name){
				return packages[i];
			}
		}
	}
})(jQuery);

(function($){
	load_packages = function(asyncBool) {
		if (packages == null) {
			$.ajax({
				dataType: "json",
				url: 'packages.min.json?' + new Date().getTime(),
				async: asyncBool,
				success: function(data){
					packages = data.packages;
				}
			});
		}
	}
})(jQuery);
