(function($){
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


  $('.search').focus();
  $('.search').on('keyup', function (ev) {
    var val = $(ev.currentTarget).val();

    console.log(val);
    if(val.length > 0 ){
      $('[data-library-name]').hide();
      $('[data-library-name*="'+val+'"]').show();
      $('[data-library-keywords*="'+val+'"]').show();
    } else {

      $('[data-library-name]').show();
    }
  });
})(jQuery);
