angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.signupData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalSignup = modal;
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
		var ref = new Firebase('https://burning-heat-294.firebaseio.com/');
        console.log('Attempting login', $scope.loginData);
 
		ref.authWithPassword({
		  email    : $scope.loginData.username,
		  password : $scope.loginData.password
		}, function(error, authData) {
		  if (error) {
			console.log("Login Failed!", error);
		  } else {
			console.log("Authenticated successfully with payload:", authData);
		  }
		});
    };

    $scope.openSignup = function() {
    	$scope.modal.hide();
    	$scope.modalSignup.show();
    }

    $scope.closeSignup = function() {
    	$scope.modalSignup.hide();
    }

    $scope.doSignup = function() {
    	console.log('Doing Signup', $scope.signupData);
		var ref = new Firebase('https://burning-heat-294.firebaseio.com/');
		ref.createUser({
		  email    :  $scope.signupData.username,
		  password :  $scope.signupData.password
		}, function(error, userData) {
		  if (error) {
			console.log("Error creating user:", error);
		  } else {
			console.log("Successfully created user account with uid:", userData.uid);
		  }
		});
    }

    $scope.goToTakePhoto = function() {
        $location.path('/app/edit_take');

    }

    $scope.goSelectPhoto = function() {
        $location.path('/app/edit_select');
    }

    $scope.goEditPhoto = function() {
        $location.path('/app/meesh_photo_edit');
    }

    $scope.settings = {
        enableFriends: true
    };
})

.controller('PhotoEditCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.brightnessValue = 10;
    $scope.decreaseBrightness = -10;
    $scope.noiseValue = 0;
    $scope.pixelate = 0;
    $scope.enableBrightness = false;
    $scope.disableBrightness = false;
    $scope.edit = {
        brightness: 50
    }

    $scope.changes = {
        bw: false
    }

    angular.element(document).ready(function() {

    	$ionicSideMenuDelegate.canDragContent(false);

        var canvas = new fabric.Canvas('canv');
        var f = fabric.Image.filters;
        var grayFilter = new fabric.Image.filters.Grayscale()
        var invertFilter = new fabric.Image.filters.Invert()
        var sepiaFilter = new fabric.Image.filters.Sepia()
        var brightFilter = new fabric.Image.filters.Brightness({
            brightness: $scope.brightnessValue
        })
        var decreaseBrightFilter = new fabric.Image.filters.Brightness({
            brightness: $scope.decreaseBrightness
        })
        var noiseFilter = new fabric.Image.filters.Noise({
            noise: $scope.noiseValue
        })
        var pixelateFilter = new fabric.Image.filters.Pixelate({
            blocksize: $scope.pixelateValue
        })

        var brightFilterDecrease = new fabric.Image.filters.Brightness({
            brightness: $scope.decreaseBrightness
        })

        var img = "../tiger.jpg"
        fabric.Image.fromURL(img, function(outImg) {
            canvas.add(outImg);
            canvas.centerObject(outImg);
            canvas.item(0).lockMovementY = true;
            canvas.item(0).lockMovementX = true;
            canvas.item(0).lockScalingX = true;
            canvas.item(0).lockScalingY = true;
            canvas.item(0).lockRotation = true;
            canvas.item(0).hasControls = false;
            canvas.item(0).hasBorders = false;
            canvas.renderAll();
            canvas.setActiveObject(outImg);
        });

        //this is scope for changing classes in HTML
        $scope.isBlackAndWhite = false;
        $scope.isSepia = false;
        $scope.isInvert = false;
        $scope.isNoise = false;
        $scope.isPixelate = false;


        $scope.isBright = function() {
            var obj = canvas.getActiveObject();
            obj.filters.push(brightFilter);
            obj.applyFilters(canvas.renderAll.bind(canvas));
        };

        $scope.notBright = function() {
            // var obj = canvas.getActiveObject();
            // fabric.util.removeFromArray(obj.filters, brightFilter);
            // obj.applyFilters(canvas.renderAll.bind(canvas));

            var obj = canvas.getActiveObject();
            obj.filters.push(brightFilterDecrease);
            obj.applyFilters(canvas.renderAll.bind(canvas));
        };

        $scope.changeBW = function() {

            if ($scope.isBlackAndWhite == true) {
                var d = document.getElementById("bwId");
                d.className = "button button-outline button-dark"
                var obj = canvas.getActiveObject();
                fabric.util.removeFromArray(obj.filters, grayFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isBlackAndWhite = false
            } else {
                var d = document.getElementById("bwId");
                d.className = "button button-outline button-dark bw-button-activate"
                var obj = canvas.getActiveObject();
                console.log(obj);
                obj.filters.push(grayFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isBlackAndWhite = true
            }


        }

        $scope.changeINV = function() {
            if ($scope.isInvert == true) {
                var d = document.getElementById("invId");
                d.className = "button button-outline button-stable"
                var obj = canvas.getActiveObject();
                fabric.util.removeFromArray(obj.filters, invertFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isInvert = false
            } else {
                var d = document.getElementById("invId");
                d.className = "button button-outline button-stable inv-button-activate"
                var obj = canvas.getActiveObject();
                obj.filters.push(invertFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isInvert = true
            }

        }

        $scope.changeSEP = function() {
            if ($scope.isSepia == true) {
                var d = document.getElementById("sepId");
                d.className = "button button-outline button-positive"
                var obj = canvas.getActiveObject();
                fabric.util.removeFromArray(obj.filters, sepiaFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isSepia = false
            } else {
                var d = document.getElementById("sepId");
                d.className = "button button-outline button-positive sep-button-activate"
                var obj = canvas.getActiveObject();
                obj.filters.push(sepiaFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isSepia = true
            }
        }

        $scope.changeNOI = function() {
            if ($scope.isNoise == true) {
                var d = document.getElementById("noiId");
                d.className = "button button-outline button-balanced"
                var obj = canvas.getActiveObject();
                fabric.util.removeFromArray(obj.filters, noiseFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isNoise = false
            } else {
                var d = document.getElementById("noiId");
                d.className = "button button-outline button-balanced noi-button-activate"
                var obj = canvas.getActiveObject();
                obj.filters.push(noiseFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isNoise = true
            }
        }

        $scope.changePXL = function() {
            if ($scope.isPixelate == true) {
                var d = document.getElementById("pxlId");
                d.className = "button button-outline button-royal"
                var obj = canvas.getActiveObject();
                fabric.util.removeFromArray(obj.filters, pixelateFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isPixelate = false
            } else {
                var d = document.getElementById("pxlId");
                d.className = "button button-outline button-royal pxl-button-activate"
                var obj = canvas.getActiveObject();
                obj.filters.push(pixelateFilter);
                obj.applyFilters(canvas.renderAll.bind(canvas));
                $scope.isPixelate = true
            }
        }

        $scope.disableAll = function() {
            var obj = canvas.getActiveObject();
            obj.filters = [];
            obj.applyFilters(canvas.renderAll.bind(canvas));

            //change back all the button color
            var d = document.getElementById("bwId");
            d.className = "button button-outline button-dark"

            var d = document.getElementById("invId");
            d.className = "button button-outline button-stable"

            var d = document.getElementById("sepId");
            d.className = "button button-outline button-positive"

            var d = document.getElementById("noiId");
            d.className = "button button-outline button-balanced"

            var d = document.getElementById("pxlId");
            d.className = "button button-outline button-royal"

            $scope.isBlackAndWhite = false;
            $scope.isSepia = false;
            $scope.isInvert = false;
            $scope.isNoise = false;
            $scope.isPixelate = false;

        };

        $scope.increaseBrightness = function() {
        	var obj = canvas.getActiveObject();
			obj.filters.push(brightFilter);
			obj.applyFilters(canvas.renderAll.bind(canvas));
        };

        $scope.decreaseBrightness = function() {
        	var obj = canvas.getActiveObject();
			obj.filters.push(decreaseBrightFilter);
			obj.applyFilters(canvas.renderAll.bind(canvas));
        }

    })
})

.controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [{
        title: 'Reggae',
        id: 1
    }, {
        title: 'Chill',
        id: 2
    }, {
        title: 'Dubstep',
        id: 3
    }, {
        title: 'Indie',
        id: 4
    }, {
        title: 'Rap',
        id: 5
    }, {
        title: 'Cowbell',
        id: 6
    }];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {});