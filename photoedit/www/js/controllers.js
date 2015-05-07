angular.module('starter.controllers', ['ionic', 'ngCordova', 'firebase'])

.controller('AppCtrl', function($ionicNavBarDelegate,$firebase, $scope, $ionicModal, $timeout, $location, $ionicPopup, $cordovaCamera, $ionicSideMenuDelegate, $firebaseArray, $firebaseObject, isLogin, $ionicBackdrop) {
    // Form data for the login modal

    $ionicSideMenuDelegate.canDragContent(true);
    $ionicNavBarDelegate.showBackButton(false);

    $scope.loginData = {};
    $scope.signupData = {};
    $scope.currentPhoto = '';
    $scope.login = isLogin.getIsLogIn();
    $scope.currentUser = '';

    var refCurrentPhoto = new Firebase('https://burning-heat-294.firebaseio.com/allphotos');
    $scope.allCurrentRoom = $firebaseArray(refCurrentPhoto);


    $scope.$watch('login', function() {
        if ($scope.login == true) {
            $scope.datas = new Firebase('https://burning-heat-294.firebaseio.com/users/' + isLogin.getFireBaseId());
            $scope.datas.on('value', function(childSnapshot) {
                if (childSnapshot.val().isInvited == true) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Someone wants to edit photo with you!',
                        template: 'Click accept to edit the photo!'
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            $location.path('/app/meesh_photo_edit');
                        } else {
                            //if not then change this to false
                            var refThree = new Firebase('https://burning-heat-294.firebaseio.com/users/' + isLogin.getFireBaseId());
                            $scope.usersel = $firebaseObject(refThree);
                            $scope.usersel.$loaded().then(function(user) {
                                console.log("2 here");
                                user.isInvited = false;
                                user.$save();
                            });
                        }
                        $ionicBackdrop.release();
                    })
                }
            });
        }
    });


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
    $scope.loginFunc = function() {
        if (isLogin.getIsLogIn()) {
            var alertPopup = $ionicPopup.alert({
                title: 'You are already log in as ' + isLogin.getEmail()
            });
        } else {
            $scope.modal.show();
        }

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
                $scope.login = true;
                console.log("Authenticated successfully with payload:", authData.password.email);
                //change the login status
                isLogin.setIsLogIn(true);
                //loop through the table to find the match
                var ref = new Firebase('https://burning-heat-294.firebaseio.com/users');
                $scope.users = $firebaseArray(ref);
                $scope.users.$loaded().then(function(user) {
                    for (var i = 0; i < user.length; i++) {
                        if ($scope.loginData.username == user[i].email) {
                            isLogin.setCurrentRoom(user[i].currentRoom);
                            isLogin.setEmail(user[i].email);
                            isLogin.setIsInvited(user[i].isInvited);
                            isLogin.setUserId(user[i].userId);
                            isLogin.setFireBaseId(user[i].$id);
                            $scope.isInvited = user[i].isInvited;
                            break;
                        }
                    }



                    var alertPopup = $ionicPopup.alert({
                        title: 'Login successful!',
                        template: 'Welcome ' + authData.password.email
                    });
                    alertPopup.then(function(res) {
                        $scope.modal.hide();

                    });
                })

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
                    $scope.users.$add({
                        userId: user.length + 1,
                        email: $scope.signupData.username,
                        isInvited: false,
                        currentRoom: 0
                    }).then(function(ref) {
                        console.log(ref.key());
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
        //only go if user is log in, if not then have an alert box

        //if user is log in 
        if (isLogin.getIsLogIn()) {
            $location.path('/app/edit_take');
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Please Login!'
            });
        }


    }

    $scope.goSelectPhoto = function() {

        if (isLogin.getIsLogIn()) {
            $location.path('/app/edit_select');
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Please Login!'
            });
        }
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
                $scope.currentPhoto = imageData;

                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;

                // var ref = new Firebase("https://burning-heat-294.firebaseio.com/photo");

                // var photoArray = $firebaseArray(ref);
                // photoArray.$add({
                //     image: imageData
                // }).then(function() {
                //     alert("Image has been uploaded");
                // });

                // var alertPopup = $ionicPopup.alert({
                //     title: 'upload',
                //     template: error
                // });
                // alertPopup.then(function(res) {

                // });

                // console.log("working");
            })

        },
        function(err) {
            // error
        };

    $scope.usePhoto = function() {
        var ref = new Firebase("https://burning-heat-294.firebaseio.com/rooms");

        var roomArray = $firebaseArray(ref);

        //state for users
        //editing - currently editing
        //done - done editing
        //not-accept - the other user doesn't accept 

        roomArray.$loaded().then(function(room) {
            room.$add({
                image: $scope.currentPhoto,
                roomId: room.length + 1,
                isBw: false,
                isInv: false,
                isSep: false,
                isNoi: false,
                isPxl: false,
                brightness: 0,
                photoOne: '',
                photoTwo: '',
                userOneState: 'editing',
                userTwoState: 'not-accept',
            }).then(function(ref) {
                isLogin.setCurrentRoom(ref.key());
                //set room for user in firebase
                var refThree = new Firebase('https://burning-heat-294.firebaseio.com/users/' + isLogin.getFireBaseId());
                $scope.usersel = $firebaseObject(refThree);
                $scope.usersel.$loaded().then(function(user) {
                    user.currentRoom = ref.key();
                    user.$save();
                    $location.path('/app/search');
                });

            });
        });

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
        $scope.currentUser = '';
    }
})

.controller('PhotoEditCtrl', function($ionicPopup, $scope, $ionicSideMenuDelegate, $window, firstTime, $location, $state, isLogin, $firebaseArray, $firebaseObject, $ionicNavBarDelegate) {


        $ionicNavBarDelegate.showBackButton(false);

        console.log(isLogin.getIsLogIn());
        console.log("I'm a controller");

        if (firstTime.getIsFirstTime() == true) {
            firstTime.setIsFirstTimeToFalse();
            $state.reload();
        }

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

        $scope.changeFirst = true;

        angular.element(document).ready(function() {

            $scope.sImg = '';
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

            var refThree = new Firebase('https://burning-heat-294.firebaseio.com/users/' + isLogin.getFireBaseId());
            $scope.usersel = $firebaseObject(refThree);
            $scope.usersel.$loaded().then(function(user) {
                //get current user current room

                $scope.cR = user.currentRoom;
                //after you get the firebase id get the room number
                $scope.imageM = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);
                $scope.imageM.on('value', function(childSnapshot) {
                    if ($scope.changeFirst == true) {
                        console.log(childSnapshot.val());
                        $scope.sImg = childSnapshot.val().image;
                        var img = "data:image/jpeg;base64," + $scope.sImg;
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

                        $scope.changeFirst = false;
                    }

                    var obj = canvas.getActiveObject();
                    obj.filters = [];
                    obj.applyFilters(canvas.renderAll.bind(canvas));

                    if (childSnapshot.val().isBw == true) {
                        var d = document.getElementById("bwId");
                        d.className = "button button-outline button-dark bw-button-activate"
                        var obj = canvas.getActiveObject();
                        console.log(obj);
                        obj.filters.push(grayFilter);
                    } else if (childSnapshot.val().isBw == false) {
                        var d = document.getElementById("bwId");
                        d.className = "button button-outline button-dark"
                        var obj = canvas.getActiveObject();
                        fabric.util.removeFromArray(obj.filters, grayFilter);
                    }

                    if (childSnapshot.val().isInv == true) {
                        var d = document.getElementById("invId");
                        d.className = "button button-outline button-stable inv-button-activate"
                        var obj = canvas.getActiveObject();
                        obj.filters.push(invertFilter);
                    } else if (childSnapshot.val().isInv == false) {
                        var d = document.getElementById("invId");
                        d.className = "button button-outline button-stable"
                        var obj = canvas.getActiveObject();
                        fabric.util.removeFromArray(obj.filters, invertFilter);
                    }

                    if (childSnapshot.val().isSep == true) {
                        var d = document.getElementById("sepId");
                        d.className = "button button-outline button-positive sep-button-activate"
                        var obj = canvas.getActiveObject();
                        obj.filters.push(sepiaFilter);
                    } else if (childSnapshot.val().isSep == false) {
                        var d = document.getElementById("sepId");
                        d.className = "button button-outline button-positive"
                        var obj = canvas.getActiveObject();
                        fabric.util.removeFromArray(obj.filters, sepiaFilter);
                    }

                    if (childSnapshot.val().isNoi == true) {
                        var d = document.getElementById("noiId");
                        d.className = "button button-outline button-balanced noi-button-activate"
                        var obj = canvas.getActiveObject();
                        obj.filters.push(noiseFilter);
                    } else if (childSnapshot.val().isNoi == false) {
                        var d = document.getElementById("noiId");
                        d.className = "button button-outline button-balanced"
                        var obj = canvas.getActiveObject();
                        fabric.util.removeFromArray(obj.filters, noiseFilter);
                    }

                    if (childSnapshot.val().isPxl == true) {
                        var d = document.getElementById("pxlId");
                        d.className = "button button-outline button-royal pxl-button-activate"
                        var obj = canvas.getActiveObject();
                        obj.filters.push(pixelateFilter);
                    } else if (childSnapshot.val().isPxl == false) {
                        var d = document.getElementById("pxlId");
                        d.className = "button button-outline button-royal"
                        var obj = canvas.getActiveObject();
                        fabric.util.removeFromArray(obj.filters, pixelateFilter);

                    }

                    obj.applyFilters(canvas.renderAll.bind(canvas));
                });
            });







            //this is scope for changing classes in HTML
            $scope.isBlackAndWhite = false;
            $scope.isSepia = false;
            $scope.isInvert = false;
            $scope.isNoise = false;
            $scope.isPixelate = false;
            $scope.isDrawing = false;

            var fb = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);

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

                //call the database and change value

                var refThree = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);
                $scope.usersel = $firebaseObject(refThree);
                $scope.usersel.$loaded().then(function(user) {
                    if (user.isBw == true) {
                        user.isBw = false;
                        user.$save();
                    } else {
                        user.isBw = true;
                        user.$save();
                    };

                });
            }

            $scope.changeINV = function() {
                var refThree = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);
                $scope.usersel = $firebaseObject(refThree);
                $scope.usersel.$loaded().then(function(user) {
                    if (user.isInv == true) {
                        user.isInv = false;
                        user.$save();
                    } else {
                        user.isInv = true;
                        user.$save();
                    };

                });

            }

            $scope.changeSEP = function() {
                var refThree = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);
                $scope.usersel = $firebaseObject(refThree);
                $scope.usersel.$loaded().then(function(user) {
                    if (user.isSep == true) {
                        user.isSep = false;
                        user.$save();
                    } else {
                        user.isSep = true;
                        user.$save();
                    };

                });
            }

            $scope.changeNOI = function() {
                var refThree = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);
                $scope.usersel = $firebaseObject(refThree);
                $scope.usersel.$loaded().then(function(user) {
                    if (user.isNoi == true) {
                        user.isNoi = false;
                        user.$save();
                    } else {
                        user.isNoi = true;
                        user.$save();
                    };

                });
            }

            $scope.changePXL = function() {
                var refThree = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);
                $scope.usersel = $firebaseObject(refThree);
                $scope.usersel.$loaded().then(function(user) {
                    if (user.isPxl == true) {
                        user.isPxl = false;
                        user.$save();
                    } else {
                        user.isPxl = true;
                        user.$save();
                    };

                });
            }

            $scope.changeDRA = function() {
                if ($scope.isDrawing == true) {
                    var d = document.getElementById("draId");
                    d.className = "button button-outline button-royal"
                    canvas.isDrawingMode = false
                    $scope.isDrawing = false
                    canvas.setActiveObject(canvas.item(0));
                } else {
                    var d = document.getElementById("draId");
                    d.className = "button button-outline button-royal pxl-button-activate"
                    canvas.isDrawingMode = true
                    canvas.freeDrawingBrush.color = "black";
                    canvas.freeDrawingBrush.width = 10;
                    $scope.isDrawing = true
                }
            }

            $scope.disableAll = function() {
                var refThree = new Firebase('https://burning-heat-294.firebaseio.com/rooms/' + $scope.cR);
                $scope.usersel = $firebaseObject(refThree);
                $scope.usersel.$loaded().then(function(user) {

                    user.isBw = false;
                    user.isInv = false;
                    user.isSep = false;
                    user.isNoi = false;
                    user.isPxl = false;
                    user.$save();


                });
            };

            $scope.clearDrawing = function() {
                var obj = canvas.getActiveObject();
                if (obj.isType("image")) {
                    //do nothing
                } else {
                    canvas.remove(obj);
                }
                canvas.setActiveObject(canvas.item(0));
            };

            $scope.saveImage = function() {
                $scope.sImg = canvas.toDataURL({
                    format: 'jpeg',
                    quality: 1
                });

                //first time this just push to the main all photo page
                var refAllPhoto = new Firebase('https://burning-heat-294.firebaseio.com/allphotos');
                $scope.allPhoto = $firebaseArray(refAllPhoto);
                $scope.allPhoto.$loaded().then(function(photo) {
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();

                    if (dd < 10) {
                        dd = '0' + dd
                    }

                    if (mm < 10) {
                        mm = '0' + mm
                    }

                    today = mm + '/' + dd + '/' + yyyy;
                    photo.$add({
                        url: $scope.sImg,
                        artist: isLogin.getEmail(),
                        currentDate: today
                    }).then(function(ref) {
                        var refThree = new Firebase('https://burning-heat-294.firebaseio.com/users/' + isLogin.getFireBaseId());
                        $scope.usersel = $firebaseObject(refThree);
                        $scope.usersel.$loaded().then(function(user) {
                            user.isInvited = false;
                            user.currentRoom = 0;
                            user.$save();

                            $location.path('/app');

                            var alertPopup = $ionicPopup.alert({
                                title: 'Image upload success!'
                            });
                            alertPopup.then(function(res) {
                                $scope.modalSignup.hide();
                            });
                        });
                    });

                });

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
    .controller('AllUsersCtrl', function($scope, $firebaseArray, $firebaseObject, isLogin, $location) {
        var refTwo = new Firebase('https://burning-heat-294.firebaseio.com/users');
        $scope.users = $firebaseArray(refTwo);

        $scope.selectPerson = function(input) {
            var refThree = new Firebase('https://burning-heat-294.firebaseio.com/users/' + input);

            $scope.usersel = $firebaseObject(refThree);
            $scope.usersel.$loaded().then(function(user) {
                user.currentRoom = isLogin.getCurrentRoom();
                user.isInvited = true;
                user.$save();
                $location.path('/app/meesh_photo_edit');
            });


            // ref.once('value', function(snap) {
            //     console.log('I fetched a user!', snap.val());
            //     snap.val().currentRoom = 20;
            //     snap.val().$save();

            // });
        }
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