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



// UserApp Integration

UserApp.initialize({ appId: "5343d12871774" });
var currentUser = null; // This will contain the logged in user

    // Check if there is a session cookie
    var token = Kaka.get("ua_session_token");
    if (token) {
      // Yes, there is
      UserApp.setToken(token);

      // Get the logged in user
      getCurrentUser(function(user) {
        if (user) {
          console.log(user);
          currentUser = user;
          onUserLoaded();
        }
      });
    } 

    // When the user has loaded
    function onUserLoaded() {
      $("#name").text(currentUser.login);
      getFavorites(putClassOnFavorites);
      $('body').addClass('authenticated');
      $('.login-box').hide();
      $('.logged-in').show();
    }

    // Get the logged in user
    function getCurrentUser(callback) {
      UserApp.User.get({ user_id: "self" }, function(error, user) {
        if (error) {
          callback && callback(null);
        } else {
          callback && callback(user[0]);
        }
      });
    }

      // Get this user's articles from the back-end


    // Logout function
    window.logout = function () {
      Kaka.remove("ua_session_token");
      UserApp.User.logout(function() {
        window.location.href = "login.html";
      });
    }



// TODO - This is some pretty ugly code by Thomas </honesty>

var favorites = [];

function getFavorites(callback) {
  $.get("http://cdnjs-server.herokuapp.com/favorites?token=" + token, function(data) {
    if (data) {
      favorites = data;
      callback(data);
    }
  }, "json");
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

$('#example .change-favorite').on('click', function(e) {

  var rowId = $(e.currentTarget).parents('tr')[0].id;
  if(!_.contains(favorites, rowId)) {
    favorites.push(rowId);
    _gaq.push(['_trackEvent', 'favorite', 'added', rowId]);

    $.ajax({
      url: 'http://cdnjs-server.herokuapp.com/favorites?token=' + token,
      success: function () {
        console.log(arguments)
      },
      type: 'POST',
      data: {library: rowId}
    })
  } else if(_.isArray(favorites) && favorites.length > 0) {
    _gaq.push(['_trackEvent', 'favorite', 'removed', rowId]);
    favorites = _.without(favorites, rowId);

    $.ajax({
      url: 'http://cdnjs-server.herokuapp.com/favorites?token=' + token,
      success: function () {
        console.log(arguments)
      },
      type: 'DELETE',
      data: {library: rowId}
    })
  }

  $('#example tr').removeClass('favorite');
  putClassOnFavorites(favorites);
});


$('p.library-url').on('mouseenter', function (event) {

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
    //var favorites = getFavorites();

    cleanSearchVal = searchVal.replace(/\./g, '').toLowerCase();

    for(var i = 0; i < libraryNameCache.length; i++) {
      var libraryName = libraryNameCache[i];
      var elem = $('#' + libraryName);
      var levDistVal = levDist(libraryName, searchVal);
      var subStringMatch = libraryName.toLowerCase().indexOf(cleanSearchVal) !== -1;
      var favorite = _.contains(favorites, libraryName);

      if(subStringMatch || levDistVal < 2) {
        libraryRanking.push({
          name: libraryName,
          levDist: levDistVal,
          favorite: favorite
        });
      }
    }

    libraryRanking = _.sortBy(libraryRanking, function(libraryMetaData) {
      // Push favorites to the top
      var modifier = libraryMetaData.favorite ? -1000 : 0;
      return modifier + libraryMetaData.levDist;
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
//putClassOnFavorites(getFavorites());
$('#search-box').focus();

})(jQuery);
