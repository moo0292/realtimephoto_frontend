// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform) {
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
  });
})
/*
.factory('Camera', ['$q', '$base64',
    function($q, $base64) {

        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, {
                    quality: 80,
                    targetWidth: 320,
                    targetHeight: 320,
                    saveToPhotoAlbum: false,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG,
                    sourceType: Camera.PictureSourceType.CAMERA
                });

                return q.promise;
            }
        }
    }
])*/


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
        templateUrl: "templates/search.html"
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
