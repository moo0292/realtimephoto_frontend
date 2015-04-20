angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $cordovaCamera) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


  $scope.takePicture = function(){
      var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) { 
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
      console.log("working");
    })
      
    }, function(err) {
      // error
    };

    $scope.getAlbumPic = function(){
      var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) { 
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
      console.log("working");
    })
      
    }, function(err) {
      // error
    };
  


  

  // Triggered in the login modal to close it


  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.goToTakePhoto = function() {
    $location.path('/app/edit_take');

  }

  $scope.goSelectPhoto = function() {
    $location.path('/app/edit_select');
  }

  $scope.goEditPhoto = function() {
    $location.path('/app/edit_photo');
  }

  $scope.settings = {
    enableFriends: true
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
