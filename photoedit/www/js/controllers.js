angular.module('starter.controllers', ['ionic', 'ngCordova', 'firebase'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, $cordovaCamera, $ionicSideMenuDelegate, $firebaseArray) {
    // Form data for the login modal

    $ionicSideMenuDelegate.canDragContent(true);
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
            email: $scope.loginData.username,
            password: $scope.loginData.password
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);

                var alertPopup = $ionicPopup.alert({
                    title: 'Login fail!',
                    template: error
                });
                alertPopup.then(function(res) {

                });

            } else {
                console.log("Authenticated successfully with payload:", authData.password.email);

                var alertPopup = $ionicPopup.alert({
                    title: 'Login successful!',
                    template: 'Welcome ' + authData.password.email
                });
                alertPopup.then(function(res) {
                    $scope.modal.hide();
                });

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
        var isNewUser = true;
        var ref = new Firebase('https://burning-heat-294.firebaseio.com/');
        ref.createUser({
            email: $scope.signupData.username,
            password: $scope.signupData.password
        }, function(error, userData) {
            if (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Signup fail!',
                    template: error
                });
                alertPopup.then(function(res) {

                });
            } else {
                var refTwo = new Firebase('https://burning-heat-294.firebaseio.com/users');
                $scope.users = $firebaseArray(refTwo);
                $scope.users.$loaded().then(function(user) {
                    console.log(user.length)
                    $scope.users.$add({
                        userId: user.length + 1,
                        email: $scope.signupData.username,
                        isInvited: false,
                        currentRoom: 0
                    });
                });

                var alertPopup = $ionicPopup.alert({
                    title: 'Signup success!'
                });
                alertPopup.then(function(res) {
                    $scope.modalSignup.hide();
                });

            }
        });
        ref.onAuth(function(authData) {
            if (authData && isNewUser) {
                // save the user's profile into Firebase so we can list users,
                // use them in Security and Firebase Rules, and show profiles
                // var refTwo = new Firebase('https://burning-heat-294.firebaseio.com/users');
                // $scope.messages = $firebaseArray(refTwo);
                // console.log("Hi");
                // $scope.messages.$add({
                //   userId: authData.uid,
                //   email: $scope.signupData.username,
                //   isInvited: false,
                //   currentRoom: 0
                // });
                // console.log(authData);
                // ref.child("users").child(authData.uid).set({
                //     provider: authData.provider,
                //     name: getName(authData)
                // });
            }
        });
        // find a suitable name based on the meta info given by each provider
        function getName(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
            }
        }
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

    $scope.showConfirm = function() {
        $scope.counter = {
            count: 30
        }

        var confirmPopup = $ionicPopup.confirm({
            title: 'A user ' + ' Kittitat Rodchaidee ' + ' want to edit photo with you',
            template: 'Click accept to edit photo with your friend. You have ten seconds to decide.'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
        $timeout(function() {
            confirmPopup.close(); //close the popup after 3 seconds for some reason
        }, 10000);
    };

    $scope.takePicture = function() {

            var options = {
                quality: 70,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 400,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
                
                var ref = new Firebase("https://burning-heat-294.firebaseio.com/photo");
                
                var photoArray = $firebaseArray(ref);
                photoArray.$add({image: imageData}).then(function() {
                	alert("Image has been uploaded");
            	});
            	
            	var alertPopup = $ionicPopup.alert({
                    title: 'upload',
                    template: error
                });
                alertPopup.then(function(res) {

                });

                //console.log("working");
            })

        },
        function(err) {
            // error
        };
      	
      	$scope.firebase = function() {
      		var ref = new Firebase("https://burning-heat-294.firebaseio.com/photo");
                
                $scope.photoArray = $firebaseArray(ref);
                $scope.photoArray.$add({
                	text: "This is working"
            	});
            	
            	console.log("Sent to firebass");
      	}

    $scope.getAlbumPic = function() {
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

        },
        function(err) {
            console.log(err)
                // error
        };

    $scope.firebaseTest = function() {
        console.log("This is working");
        var currentUser = {};
        var myRef = new Firebase("https://burning-heat-294.firebaseio.com/")
        var authData = myRef.getAuth();

        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out");
        }

        //Write data... ....
        console.log(authData.uid);
        var userRef = myRef.child("Photos");
        userRef.set({
            "Photos": {
                name: "photo3.jpg",
                size: "3.33",
                url: "http://google.com"

            }
        });

        var myRef = new Firebase("https://burning-heat-294.firebaseio.com/")
        myRef.on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                console.log(data.val());
            });
        });
    }
})

.controller('PhotoEditCtrl', function($scope, $ionicSideMenuDelegate, $window) {
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

		$scope.sImg = "../tiger.jpg";
        $ionicSideMenuDelegate.canDragContent(false);

        var canvas = new fabric.Canvas('canv');
        canvas.setHeight(300);
		canvas.setWidth($window.innerWidth - 20);
        
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

        var img = "data:image/jpeg;base64," + "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"
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
		$scope.isDrawing = false;

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
        
        $scope.changeDRA = function() {
        	if ($scope.isDrawing == true) {
        		var d = document.getElementById("draId");
                d.className = "button button-outline button-royal"
                canvas.isDrawingMode = false
                $scope.isDrawing = false
        	}
        	else {
        		var d = document.getElementById("draId");
                d.className = "button button-outline button-royal pxl-button-activate"
                canvas.isDrawingMode = true
        		canvas.freeDrawingBrush.color = "black";
       		 	canvas.freeDrawingBrush.width = 10;
        		$scope.isDrawing = true
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
        
        $scope.clearDrawing = function() {
        	var obj = canvas.getActiveObject();
        	if (obj.isType("image")) {
	        	//do nothing
        	}
        	else {
        		canvas.remove(obj);
        	}
        };
        
        $scope.saveImage = function() {
        	$scope.sImg = canvas.toDataURL({
        		format: 'jpeg',
        		quality: 1
        	});
        	console.log(sImg);
        };
        
        $scope.reload = function() {
        	$window.location.reload();
        }

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
.controller('AllUsersCtrl', function($scope, $firebaseArray, $firebaseObject) {
    var refTwo = new Firebase('https://burning-heat-294.firebaseio.com/users');
    $scope.users = $firebaseArray(refTwo);
    
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