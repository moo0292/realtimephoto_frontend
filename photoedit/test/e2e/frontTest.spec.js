describe('photo edit', function() {


	//move to home.html
	beforeEach(function () {
    	browser.get('/#/app/');
    	console.log(browser.getLocationAbsUrl());
  	});

  	it('should rediredt to /home when location hash is unknown', function() {
  		expect(browser.getLocationAbsUrl()).toMatch("/home");
  	});


});