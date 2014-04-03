(function($){
function selectText(element) {
    var doc = document;
    var text = element;
    var range;

    if (doc.body.createTextRange) { // ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { // moz, opera, webkit
        var selection = window.getSelection();
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function getFavoritesCookie() {
  var favorites = $.cookie('favorites');
  return favorites && favorites.split(',') || ['json2', 'handlebarsjs', 'jqueryui', 'fancybox', 'bootstrap-datepicker', 'html5shiv', 'momentjs', 'angular-ui-bootstrap', 'underscorejs', 'modernizr', 'foundation', 'lodashjs', 'd3', 'angularjs', 'font-awesome', 'twitter-bootstrap', 'jquery'];
}

function putClassOnFavorites(favorites) {
  _.each(favorites, function(favId) {
    favId = '#' + favId;
    var element = $(favId).clone(true);
    element.addClass('favorite');
    $(favId).remove();
    $('#example tbody').prepend(element);
  });
}

$('#example .change-favorite').on('click', function(e) {
  var favorites = getFavoritesCookie();
  var rowId = $(e.currentTarget).parents('tr')[0].id;
  if(!_.contains(favorites, rowId)) {
    favorites.push(rowId);
  } else if(_.isArray(favorites) && favorites.length > 0) {
    favorites = _.without(favorites, rowId);
  }

  // Update the list of libraries with favorites at the top
  $('#example tr').removeClass('favorite');
  putClassOnFavorites(favorites);

  // Save the cookie
  $.cookie('favorites', favorites.join(','), {expires: 365});
});

// Put favorite libraries at the top of the list
putClassOnFavorites(getFavoritesCookie());

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
