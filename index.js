function selectText(element) {
    var doc = document;
    var text = element;    

    if (doc.body.createTextRange) { // ms
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { // moz, opera, webkit
        var selection = window.getSelection();            
        var range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
$('p.library-url').on('mouseenter', function (event) {
  selectText($(event.currentTarget)[0]);
});


var packages = null;
var template = null;
var strVar="";
strVar += "    <% _.each(package.assets, function(asset) { %>";
strVar += "        <tr class=\"version\">";
strVar += "            <td class=\"versionlabel\"><%= asset.version %><\/td>";
strVar += "        <\/tr>";
strVar += "        <% _.each(asset.files, function(file) { %>";
strVar += "            <tr class=\"library\">";
strVar += "                <td>";
strVar += "                    <p  class='library-url'>\/\/cdnjs.cloudflare.com\/ajax\/libs\/<%= package.name %>\/<%= asset.version %>\/<%=file%><\/p>";
strVar += "                <\/td>";
strVar += "            <\/tr>";
strVar += "        <% }); %>";
strVar += "    <% }); %>";

$(document).ready(function(){
	$(".btn-version-files").on("click", function(e){
		e.preventDefault();
		var package_name = $(e.currentTarget).attr('package-name');

		$("#LAZY_" + package_name.replace('.', '')).html(_.template(strVar, {package: load_versions(package_name)}))
		$(this).siblings('.filesandversions').slideToggle(200);
		$(this).siblings('.filesandversions').find('p.library-url').on('mouseenter', function (event) {
  selectText($(event.currentTarget)[0]);
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
$('.search').focus();
  $('.search').on('keyup', function (ev) {
var val = $(ev.currentTarget).val();

console.log(val);
if(val.length > 0 ){
$('[data-library-name]').hide();
$('[data-library-name*="'+val+'"]').show();
} else {

$('[data-library-name]').show();
}
});
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
