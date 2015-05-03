// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova', 'firebase'])


.factory('firstTime', [function () {
  
  var isFirstTime = true;

  return {
    getIsFirstTime: function() {
      return isFirstTime;
    },
    setIsFirstTimeToFalse: function() {
      isFirstTime = false;
    }
  };
}])
.factory('isLogin', [function () {
  
  var isLogIn = false;
  var currentRoom = '';
  var email = '';
  var isInvited = false;
  var userId = 0;
  var firebaseId = '';

  return {
    getIsLogIn: function() {
      return isLogIn;
    },
    setIsLogIn: function(input) {
      isLogIn = input;
    },
    getCurrentRoom: function() {
      return currentRoom;
    },
    setCurrentRoom: function(input) {
      currentRoom = input;
    },
    getEmail: function() {
      return email;
    },
    setEmail: function(input) {
      email = input;
    },
    getIsInvited: function() {
      return isInvited;
    },
    setIsInvited: function(input) {
      isInvited = input;
    },
    getUserId: function() {
      return userId;
    },
    setUserId: function(input) {
      userId = input;
    },
    getFireBaseId: function() {
      return firebaseId;
    },
    setFireBaseId: function(input) {
      firebaseId = input;
    }
  };
}])
.run(function($ionicPlatform, firstTime) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    console.log("test");
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'AllUsersCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })
    .state('app.setting', {
      url: "/setting",
      views: {
        'menuContent': {
          templateUrl: 'templates/setting.html'
        }
      }
    })
    .state('app.photo_edit_main', {
      url: "/edit_main",
      views: {
        'menuContent': {
          templateUrl: 'templates/photo_edit_main.html'
        }
      }
    })
    .state('app.photo_edit_select', {
      url: "/edit_select",
      views: {
        'menuContent': {
          templateUrl: 'templates/photo_edit_select.html'
        }
      }
    })
    .state('app.photo_edit_take', {
      url: "/edit_take",
      views: {
        'menuContent': {
          templateUrl: 'templates/photo_edit_take.html'
        }
      }
    })
    .state('app.edit_photo', {
      url: "/edit_photo",
      views: {
        'menuContent': {
          templateUrl: 'templates/edit_photo.html'
        }
      }
    })
    .state('app.meesh_photo_edit', {
      url: "/meesh_photo_edit",
      views: {
        'menuContent': {
          templateUrl: 'templates/meesh_photo_edit.html',
          controller: 'PhotoEditCtrl'
        }
      }
    })
  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
