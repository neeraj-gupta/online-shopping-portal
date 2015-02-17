var request = require('supertest');
var app = require('../app');

describe("Listing buyers for admin", function() {
  it("returns all buyers", function(done) {
    request(app)
      .get("/adminBuyers")
      .expect(200, done);
  });
});

describe("search product", function() {
	  it("search and get the products which matches the input paramaters", function(done) {
	    request(app)
	      .get("/searchProduct?category=electronics&product_title=ipad")
	      .expect(200, done);
	  });
	});

describe("searchperson", function() {
	  it("search person which matches the input paramaters", function(done) {
	    request(app)
	      .get("/searchperson?firstname=Ram")
	      .expect(200, done);
	  });
	});

describe("login", function() {
	  it("login", function(done) {
	    request(app)
	      .post("/login")
	      .send({inputEmail:'ram@gmail.com', inputPwd: 'abcd'})
	      .expect(200, done);
	  });
	});


/*

describe("selling history", function() {
	  it("sellinghistory of  a person", function(done) {
	    request(app)
	      .get("/sellingHistory")
	      .expect(200, done);
	  });
	});


describe("buying History", function() {
	  it("buying History of  a person", function(done) {
	    request(app)
	      .get("/buyingHistory")
	      .expect(200, done);
	  });
	});


describe("bidding History", function() {
	  it("bidding History of  a person", function(done) {
	    request(app)
	      .get("/biddingHistory")
	      .expect(200, done);
	  });
	});



describe("fetch Person Details", function() {
	  it("fetch Person Details", function(done) {
	    request(app)
	      .get("/fetchPersonDetails")
	      .expect(200, done);
	  });
	});
*/












