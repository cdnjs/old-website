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
    var $element = $(favId);
    var $clonedElement = $element.clone(true);
    $element.remove();
    $clonedElement.addClass('favorite');
    $('#example tbody').prepend($clonedElement);
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

//http://www.merriampark.com/ld.htm, http://www.mgilleland.com/ld/ldjavascript.htm, Damerau–Levenshtein distance (Wikipedia)
function levDist(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}

// TODO: generate this as part of the template
rowSelector = '#example > tbody > tr';
matchedRowSelector = '#example tr.search-result';
libraryNameCache = _.pluck($(rowSelector), 'id');
$rowCache = null;

function filterLibraries(searchVal) {
  $rowCache = $rowCache || $(rowSelector);

  if(searchVal.length > 0 ){
    var libraryRanking = [];

    cleanSearchVal = searchVal.replace(/\./g, '').toLowerCase();

    for(var i = 0; i < libraryNameCache.length; i++) {
      var libraryName = libraryNameCache[i];
      var elem = $('#' + libraryName);
      var levDistVal = levDist(libraryName, searchVal);
      var subStringMatch = libraryName.toLowerCase().indexOf(cleanSearchVal) !== -1;

      if(subStringMatch || levDistVal < 2) {
        libraryRanking.push({
          name: libraryName,
          levDist: levDistVal
        });
      }
    }

    libraryRanking = _.sortBy(libraryRanking, function(libraryMetaData) {
      return libraryMetaData.levDist;
    });

    $(matchedRowSelector).empty();
    $rowCache.hide();

    for(var j = 0; j < libraryRanking.length; j++) {
      var libraryMetaData = libraryRanking[j];
      var element = _.findWhere($rowCache, { id: libraryMetaData.name });
      var $clonedElement = $(element).clone(true).show();
      $clonedElement.addClass('search-result');
      $('#example tbody').append($clonedElement);
    }
  } else {
    $(matchedRowSelector).empty();
    $rowCache.show();
  }
}

function searchHandler(ev) {
  var val = $(ev.currentTarget).val();
  filterLibraries(val);
}

$('#search-box').on('keyup', _.debounce(searchHandler, 300));

// Put favorite libraries at the top of the list
putClassOnFavorites(getFavoritesCookie());
$('#search-box').focus();

})(jQuery);