var ejs = require("ejs");
var mysql = require('./mysql');
var mysqlpool = require('./dbConnection/mysqlQuery');
var globals = require('./globals');

//(parameters needed from front end)
//sellproduct(producttitle, condition, category, subcategory, quantity, description, sellingprice, listing_type, memberid, startingdate,
//enddate, startingprice

// conditions to check in front end -  starting and end date should be in the format 'yyyy-mm-dd hh:mm:ss' and (end date > start date)  

function sellProduct(req, res) {

    // add an entry in Product table
	//initially initial_qauntity and available_quantity will be same
	
	var d = new Date();
	var product_id=d.getTime();
	
	var createproduct="insert into product (product_id,product_title,product_condition,category,subcategory,available_quantity," +
			"initial_quantity,product_description,instant_sellingprice,listing_type) values ("+product_id + ",'"+req.param("producttitle")+
			"','"+req.param("condition")+"','"+req.param("category")+"','"+req.param("subcategory")+"',"+req.param("quantity") +
			","+req.param("quantity")+",'"+req.param("description")+"',"+req.param("sellingprice")+",'"+req.param("listing_type")+"')";

	console.log("Query is:"+createproduct);
	
	mysqlpool.execQuery(createproduct,'',function(err,results){
		if(err){
			console.log("Error while inserting into db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			console.log("Product updsate ::::::");
		}
    });
	
	// add an entry in seller table
	
	var createSeller = "insert into seller (sellerid,product_id,selling_time, product_title,sellerfirstname, sellerlastname) values(" + globals.user_Id+ "," + product_id + ",now(),'" + req.param("producttitle") + "','" + globals.usrFName  + "','" + globals.usrLName + "')";
	console.log("Query is:" + createSeller);
	
	mysqlpool.execQuery(createSeller,'',function(err,results){
		if(err){
			console.log("Error while inserting into db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			console.log("Success seller");
		}
    });
	
	// if listing type is auction then add an entry in auction table
	//initially starting price and current price will be same
	console.log(req.param("listing_type").toLowerCase());
	if(req.param("listing_type") === "auction"){
		var dt = new Date();
		var auction_id=dt.getTime();
		
		var createAuction = "insert into auction (seller_id,product_id,auction_starting_date,auction_end_date,auction_starting_price,current_price) values (" + globals.user_Id + ","+product_id+",'"+
				req.param("startingdate")+"','"+req.param("enddate")+"',"+req.param("sellingprice")+","+req.param("sellingprice")+")";
		
		console.log("Query is:" + createAuction);
	
		mysqlpool.execQuery(createAuction,'',function(err,results){
			if(err){
				console.log("Error while inserting into db");
				res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
			} else {
				console.log('Inserted success');
			}
		});
		
	}//if auction	
	res.render('Success', {title : 'Success/eBay', userName : globals.usrFName , content : 'Successfully Added Item To sell!!!'});
	
}// sell product

exports.sellProduct = sellProduct;

exports.index = function(req,res){
	res.render('sell', {title : 'sell/eBay'});
};