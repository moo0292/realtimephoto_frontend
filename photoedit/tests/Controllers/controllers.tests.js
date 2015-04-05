describe('Controllers', function(){
    var scope;


    beforeEach(function() {
        browser().navigateTo('/');
    });
    
    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller, $ionicModal) {
        scope = $rootScope.$new();
        $controller('AppCtrl', {$scope: scope, $ionicModal: $ionicModal});
            }));

    // tests start here
    it('should have enabled friends to be true', function(){
        expect(scope.settings.enableFriends).toEqual(true);
        console.log(scope.settings.enableFriends);

    });
});