/**
 * New node file
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var mysqlpool = require('./dbConnection/mysqlQuery');

var globals = require('./globals');

function checkAuction()
{
	setInterval(auction,60000); //1000ms = 1 second ; 60,000 ms = 1 minute
	//auction();
}

//execute auction function for every minute
function auction() {

	console.log("inside auction");
	
    // check for the auctions that has end just now, not the ones that has been closed already
	// live auctions wont have buyerid in them
	
	var checkAuctionTime="select auction_id from auction where TIMESTAMPDIFF(MINUTE,now(), auction_end_date)<=0 and buyer_id is null";

	console.log("Query is:"+checkAuctionTime);
	
	mysqlpool.execQuery(checkAuctionTime,'',function(err,results){
		if(err){
			console.log("Error while fetching data");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			// any auction has end
			var json='';
			if(results.length > 0){
				
				console.log("length"+results.length);
				
				//for each auction that has end, do the following
				for(var i=0;i<results.length;i++)
				{
					 // to check highest bid for an auction
					var auctid = results[i].auction_id;
					var fetchLastBidder="select * from bid where auction_id="+results[i].auction_id+" and bid_price=(select MAX(bid_price) from bid)";
					console.log("Query is:"+fetchLastBidder);
					
					
			        	mysqlpool.execQuery(fetchLastBidder,'',function(err,bidresults){
						if(err){
							console.log("Error while fetching data");
							res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
						}
						else
							{
							  //found the highest bidder, give him the product 
							  //update in buyer table,
							if(bidresults.length > 0){
							  var buyproduct="insert into buyer (product_id,buyerid,buying_time,buyerfirstname,buyerlastname,product_title) values ("+
							  bidresults[0].product_id+ ","+bidresults[0].bidder_id+",now(),'"+bidresults[0].bidderfirstname+"','"+
							  bidresults[0].bidderlastname+"','"+bidresults[0].product_title+"')";
							  console.log("Query is:"+buyproduct);
							  
							 
							 mysqlpool.execQuery(buyproduct,'',function(err,buyresults){
								if(err){
									console.log("Error while inserting into db");
									res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
								   }
							 });
						     // },buyproduct);
							 
							  // update auction table for setting the buyer id
							
								var updateAuction = "update auction set buyer_id="+bidresults[0].bidder_id+" where auction_id="+auctid;
								console.log("Query is:" + updateAuction);
							
								 mysqlpool.execQuery(updateAuction,'',function(err,updateresults){
								if(err){
										console.log("Error while inserting into db");
										res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
										}
								 });
								//},updateAuction);
									
								// update product table to reduce quantity // for auction we consider that we are selling all the quantities of a product
								var updateProduct = "update product set available_quantity=available_quantity-1 where product_id="+bidresults[0].product_id;
								
								console.log("Query is:" + updateProduct);
							
								 mysqlpool.execQuery(updateProduct,'',function(err,updateprodresults){
									if(err){
										console.log("Error while inserting into db");
										res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
									}
							
								 });
							
							}//else
			        	 
							}//if there r results in bidding table
			        	});
			    }//for
			}//if
		}//else
 
	});
}//auction



function getAuction(req,res)
{
	var getallAuction="select * from auction_report_view;";

	console.log("Query is:"+getallAuction);
	mysqlpool.execQuery(getallAuction,'',function(err,results){
		if(err){
			console.log("Error while fetching data");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			
			var json='';
			if(results.length > 0){
				
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				console.log(json);
				res.jsonp(json);
				
			}//if
		}//else
		
	},getallAuction);
	
}



exports.auction = auction;
exports.checkAuction = checkAuction;
exports.getAuction = getAuction; 