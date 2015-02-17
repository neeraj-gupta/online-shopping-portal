var ejs = require("ejs");
var globals = require('./globals');
var mysqlpool = require('./dbConnection/mysqlQuery');

exports.displayPayment = function(req,res){
	 console.log('In Payment Details');
	 var cartVal = "select product_id,product_title,product_price,quantity,product_price*quantity AS 'Sum' from  shoppingcart where buyer_id="+globals.user_Id;
	 console.log("Query is:"+cartVal);
	 mysqlpool.execQuery(cartVal,'',function(err,results){
		if(err){
			console.log("Error while fetching from db for cart");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}else{
			if(results.length > 0){
				globals.cartRes = JSON.parse(JSON.stringify(results));
				console.log("length"+globals.cartRes.length);
				console.log(globals.cartRes);
				res.render('paymentDetails', {title : 'payment/eBay', userName : globals.usrFName });
			} else {
				globals.cartRes = '';
				res.render('paymentDetails', {title : 'payment/eBay', userName : globals.usrFName });
			}
		}
	 });
};

exports.paymentDetails = function (req,res){
	console.log("Inside paymentDetails function...");
	var pwd = req.param("password");
	var payment_type = req.param("payment_type");
	var acc_no = req.param("payment_accno");
	
	//console.log('R : ' + globals.cartRes);
	//console.log("S Len : " + globals.cartRes.length);
	// add an entry in buyers table
	if(globals.cartRes.length > 0){
		for(var i=0; i < globals.cartRes.length; i++){
			console.log('i : ' + globals.cartRes[i].product_id);
			var buyproduct = "insert into buyer (product_id,buyerid,buying_time,buyerfirstname,buyerlastname,product_title) values ("+ globals.cartRes[i].product_id + ","+globals.user_Id+",now(),'" + globals.usrFName + "','" + globals.usrLName + "','" + globals.cartRes[i].product_title + "')";
			console.log("Query is:" + buyproduct);
			
			// reduce the quantity  and add payment details in product table
			var updateProduct = "update product set available_quantity=available_quantity-" + globals.cartRes[i].quantity + " where product_id=" + globals.cartRes[i].product_id;
			console.log("Query is:" + updateProduct);
			
			var deleteEntry = "delete from shoppingcart where buyer_id=" + globals.user_Id;
			console.log("Query is:" + deleteEntry);
			
				mysqlpool.execQuery(buyproduct,'',function(err,results){
					if(err){
						console.log("Error while inserting into db");
						res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
					} else {
						console.log("Successfully inserted into db");
						console.log("before break");
						mysqlpool.execQuery(updateProduct,'',function(err,results){
							console.log("Result : " + results);
							if(err){
								console.log('Error');
								res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
							} else {
								console.log("before break");
								mysqlpool.execQuery(deleteEntry,'',function(err,results){
									console.log("Result : " + results);
									if(err){
										console.log('Error');
										res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
									} else {
										res.render('userHome',{title : 'userHome', userName : globals.usrFName,result : globals.resultSet});
									}
								});
							}
						});
					}
				});
			}
	} else {
		res.render('userHome',{title : 'userHome', userName : globals.usrFName,result : globals.resultSet});
	}
	// Empty the result set
	globals.cartRes = '';
};