var ejs = require("ejs");
var globals = require('./globals');
var mysqlpool = require('./dbConnection/mysqlQuery');

// ui should allow to bid for only live auctions, not the closed auctions
// function bidProduct(memberid , productid , bidprice price, auction_id)

function bidProduct(req, res) {
    // add an entry in bid table
	var dt = new Date();
	var bidid = dt.getTime();
	console.log('Auc Id : , bid price' + req.param("auction_id")+" "+req.param("val"));
	
	var insertBid = "insert into bid (auction_id,bidder_id,product_id,bid_price,bid_time,bidderfirstname,bidderlastname,product_title) values ("+req.param("auction_id")+","+
	globals.user_Id + "," + req.param("product_id") + "," + req.param("val") + ",now(),'"+ globals.usrFName+"','"+globals.usrLName+"','"+req.param("product_title")+"')";
	console.log("Query is:"+insertBid);
	
	var updateProduct = "update product set instant_sellingprice="+req.param("val")+" where product_id="+req.param("product_id");
	console.log("Query is:" + updateProduct);
	
	mysqlpool.execQuery(insertBid,'',function(err,results){
		if(err){
			console.log("Error while inserting into db");
			res.render('error', {title : 'error/eBay', userName : globals.usrFName, Error : 'Something Went Wrong!! PLease Try Again'});
		} else {
			//res.end();
			mysqlpool.execQuery(updateProduct,'',function(err,results){
				if(err){
					console.log("Error while inserting into db");
					res.render('error', {title : 'error/eBay', userName : globals.usrFName, Error : 'Something Went Wrong!! PLease Try Again'});
				} else {
					res.render('Success', {title : 'Success/eBay', userName : globals.usrFName , content : 'Successfully PLaced Bid!!!'});
				}
		    });	
		}
    });
	
}//bidproduct

exports.bidProduct = bidProduct;