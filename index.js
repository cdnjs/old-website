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

$('#example .change-favorite').on('click', function updateFavorites(e) {
  var favorites = getFavoritesCookie();
  var rowId = $(e.currentTarget).parents('tr')[0].id;
  if(!_.contains(favorites, rowId)) {
    favorites.push(rowId);
    _gaq.push(['_trackEvent', 'favorite', 'added', rowId]);
  } else if(_.isArray(favorites) && favorites.length > 0) {
    _gaq.push(['_trackEvent', 'favorite', 'removed', rowId]);
    favorites = _.without(favorites, rowId);
  }

  // Update the list of libraries with favorites at the top
  $('#example tr').removeClass('favorite');
  putClassOnFavorites(favorites);

  // Save the cookie
  $.cookie('favorites', favorites.join(','), {expires: 365});
});

$('p.library-url').on('mouseenter', function selectOnHover(event) {
  selectText($(event.currentTarget)[0]);
});

// TODO: generate this as part of the template
rowSelector = '#example > tbody > tr';
libraryNameCache = _.pluck($(rowSelector), 'id');

function filterLibraries(searchVal) {
  if(searchVal.length > 0 ){
    for(var i = 0; i < libraryNameCache.length; i++) {
      var libraryName = libraryNameCache[i];
      var elem = $('#' + libraryName);

      searchVal.indexOf(libraryName) !== -1 ? elem.show() : elem.hide();
    }
  } else {
    $(rowSelector).show();
  }
}

function searchHandler(ev) {
  var val = $(ev.currentTarget).val();
  filterLibraries(val);
}

$('#search-box').on('keyup', searchHandler);

// Put favorite libraries at the top of the list
putClassOnFavorites(getFavoritesCookie());
$('#search-box').focus();

})(jQuery);