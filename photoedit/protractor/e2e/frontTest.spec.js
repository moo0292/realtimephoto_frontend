describe('photo edit', function() {


	//move to home.html
	beforeEach(function () {
    	browser.get('http://localhost:8100/#/app/search');
  	});

  	it('should rediredt to /search when location hash is set to search', function() {
  		expect(browser.getLocationAbsUrl()).toMatch("/app/search");
  	});

  	it('should redirect to /home when it goes to unknown page', function() {
  		browser.get('http://localhost:8100/#/app/random');
  		expect(browser.getLocationAbsUrl()).toMatch("/app/home");
  	});

  	it('should go to select photo page, when click on button', function() {
  		browser.get('http://localhost:8100/#/app/edit_main');
  		element(by.id('select-photo')).click();
  		expect(browser.getLocationAbsUrl()).toMatch("/app/edit_select");
  	})
});