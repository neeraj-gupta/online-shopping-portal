var ejs = require("ejs");
var mysql = require('./mysql');
var mysqlpool = require('./dbConnection/mysqlQuery');

//(parameters needed from front end)
//function buyProduct(product_id, buyerid, payment_type, payment_accno,quantity, listingtype)

// not updating  payement_type and payement_accno because it is already there in table. 

// so when displaying payement page should also fetch those details and print on screen.

function buyProduct(req, res) {

   // add an entry in buyers table
	
	var buyproduct="insert into buyer (product_id,buyerid,buying_time) values ("+ req.param("product_id") + ","+req.param("buyerid")+",now())";

	console.log("Query is:"+buyproduct);
	
	mysqlpool.execQuery(buyproduct,'',function(err,results){
		if(err){
			console.log("Error while inserting into db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
    });
	
	// reduce the quantity  and add payment details in product table
	var updateProduct = "update product set available_quantity=available_quantity-"+req.param("quantity")+" where product_id="+req.param("product_id");
		
	
	console.log("Query is:" + updateProduct);
	
	mysqlpool.execQuery(updateProduct,'',function(err,results){
		if(err){
			console.log("Error while inserting into db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
    });
	
	
}// buy product



exports.buyProduct = buyProduct;