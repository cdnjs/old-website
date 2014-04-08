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
    var element = $(favId).clone(true);
    element.addClass('favorite');
    $(favId).remove();
    $('#example tbody').prepend(element);
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

// Put favorite libraries at the top of the list

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
