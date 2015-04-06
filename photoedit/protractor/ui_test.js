var Browser = require("zombie");
var assert = require("assert");

browser = new Browser();
browser.visit("http://localhost:8100/#/app/home", function() {

	console.log(browser.html());

});

