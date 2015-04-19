angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

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
  
  $scope.counter = 30;
    $scope.onTimeout = function(){
        $scope.counter--;
         if ($scope.counter > 0) {
            mytimeout = $timeout($scope.onTimeout,1000);
        }
        else {
            alert("Invite has expired");
        }
    }
    var mytimeout = $timeout($scope.onTimeout,1000);
	
	$scope.start= function(){
        $scope.counter = 30;
        mytimeout = $timeout($scope.onTimeout,1000);
    }

    
  
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
