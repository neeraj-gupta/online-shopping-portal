var ejs = require("ejs");
var mysql = require('./mysql');
var squel = require('squel');
var globals = require('./globals');
var mysqlpool = require('./dbConnection/mysqlQuery');

//searchProduct(search, )
// brand_name, product_condition,category, sub_category, Price_range)
function search(req,res){	
	//var getProduct="select * from product where lower(product_title) like '%"+(req.param("search")).toLowerCase()+"%'" +
	//" and product_condition= ";

    var search=req.param("search");
    var category=req.param("category");
    var subcategory=req.param("subcategory");
    var condition=req.param("condition");
    var listing_type= req.param("listing_type");
    var lowestprice=req.param("lowestprice");
    var highestprice=req.param("highestprice");
    
	var searchproduct=squel.select().from("product_view")
	
	if(search!=='' && search!==undefined)
		searchproduct.where("product_title like '%"+search+"%'")
	if(category!=='' && category!==undefined)
		searchproduct.where("category='"+category+"'")
	if(subcategory!=='' && subcategory!==undefined)
		searchproduct.where("subcategory='"+subcategory+"'")
	if(condition!=='' && condition!==undefined)
		searchproduct.where("product_condition='"+condition+"'")
	if(lowestprice!=='' && lowestprice!==undefined)
		searchproduct.where("instant_sellingprice>="+lowestprice)
	if(highestprice!=='' && highestprice!==undefined)
		searchproduct.where("instant_sellingprice<="+highestprice)
	if(listing_type!=='' && listing_type!==undefined)
		searchproduct.where("listing_type='"+listing_type+"'")
		
	searchproduct+='\0';	
	
	console.log("Query is:"+searchproduct);
	
	mysqlpool.execQuery(searchproduct,'',function(err,results){
		if(err){
			console.log("Error while fetching data");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			if(results.length > 0){
				console.log("length"+results.length);	
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				if(subcategory!='' && subcategory!==undefined){
					res.render('product', { title: 'Products/ebay', userName : globals.usrName, result : resultSet, error:"", subCategory:subcategory, searchString:""});
				} else {
					res.render('product', { title: 'Products/ebay', userName : globals.usrName, result : resultSet, error:"", searchString:search, subCategory:""});
				}
			} else {
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				if(subcategory!='' && subcategory!==undefined){
					console.log(subcategory);
					res.render('product', { title : 'Products/ebay', error : "No Results found!" ,result: resultSet, searchString:search, subCategory:subcategory});
				} else {
					res.render('product', { title : 'Products/ebay', error : "No Results found!" ,result: resultSet, searchString:search, subCategory:subcategory});
				}
			}
		}
	});
}

//searchProduct(search, )
//brand_name, product_condition,category, sub_category, Price_range)
function searchProduct(req, res) {
	//var getProduct="select * from product where lower(product_title) like '%"+(req.param("search")).toLowerCase()+"%'" +
	//" and product_condition= ";
	var search = req.param("search");
	var category = req.param("category");
	var subcategory = req.param("subcategory");
	var condition = req.param("condition");
	var listing_type = req.param("listing_type");
	var lowestprice = req.param("lowestprice");
	var highestprice = req.param("highestprice");

	var searchproduct = squel.select().from("product_view")

	if (search !== '' && search !== undefined)
		searchproduct.where("product_title like '%" + search + "%'")
	if (category !== '' && category !== undefined)
		searchproduct.where("category='" + category + "'")
	if (subcategory !== '' && subcategory !== undefined)
		searchproduct.where("subcategory='" + subcategory + "'")
	if (condition !== '' && condition !== undefined)
		searchproduct.where("product_condition='" + condition + "'")
	if (lowestprice !== '' && lowestprice !== undefined)
		searchproduct.where("instant_sellingprice>=" + lowestprice)
	if (highestprice !== '' && highestprice !== undefined)
		searchproduct.where("instant_sellingprice<=" + highestprice)
	if (listing_type !== '' && listing_type !== undefined)
		searchproduct.where("listing_type='" + listing_type + "'")

	searchproduct += '\0';

	console.log("Query is:" + searchproduct);
	var data = false;
	globals.exportclient().hmget(
			"searchProduct",
			searchproduct,
			function(error, result) {
				if (error)
					console.log('Error: ' + error);
				else {
					data = result;
					//console.log("data"+data+"--");
					if (data !== false && data.length === 0 && data!==undefined ) {
						//data cached already
						console.log("cached");				
						//res.jsonp(data);
						res.render('product', { title: 'Products/ebay', userName : globals.usrName, result : data, error:"", subCategory:subcategory, searchString:""});
					} else {
						mysqlpool.execQuery(searchproduct, '', function(err,
								results) {
							if (err) {
								console.log("Error while fetching data");
								throw err;
							} else {
								// any auction has end
								if (results.length > 0) {
										console.log("length"+results.length);	
										//json=JSON.stringify(results);
										resultSet = JSON.parse(JSON.stringify(results));
										globals.exportclient().hdel("searchProduct",searchproduct);
										globals.exportclient().hmset("searchProduct",searchproduct,resultSet);
										
										//console.log(resultSet);
										if(subcategory!='' && subcategory!==undefined)
										{
											res.render('product', { title: 'Products/ebay', userName : globals.usrName, result : resultSet, error:"", subCategory:subcategory, searchString:""});
										}
										else
										{
											res.render('product', { title: 'Products/ebay', userName : globals.usrName, result : resultSet, error:"", searchString:search, subCategory:""});
										} 
								}//if
								else // no results
								{
										var resultSet=JSON.stringify("No results found");
										console.log(resultSet);
										if(subcategory!='' && subcategory!==undefined)
										{
											console.log(subcategory);
											res.render('product', { title : 'Products/ebay', error : "No Results found!" ,result: resultSet, searchString:search, subCategory:subcategory, userName:globals.usrFName});
										}
										else
										{
											res.render('product', { title : 'Products/ebay', error : "No Results found!" ,result: resultSet, searchString:search, subCategory:subcategory, userName:globals.usrFName});
										} 
								}
							}//else execquery
						});//exec query
					}// else data not cached
				}//else
			});//hmget
}//search

//fetch auctionable products

function listauctioableProduct(req, res) {
	var getauctionableproducts = " select product_id,product_title,instant_Sellingprice from product where listing_type='auction'"

	console.log("Query is:" + getauctionableproducts);
	var resultSet = "";
	mysqlpool.execQuery(getauctionableproducts, '', function(err, results) {
		if (err) {
			console.log("Error while  fetching buyers from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {

			if (results.length > 0) {
				console.log("length" + results.length);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					userName : globals.usrName,
					result : resultSet
				});

			}//if
			else // no results
			{
				var resultSet = JSON.stringify("No results found");
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					error : "No resutls found",
					result : resultSet
				});
			}
		}//else
	});
}//listauctioableProduct


//fetch  directly buyable products - Fixedprice

function listbuyableProduct(req, res) {
	var getbuyableproducts = " select product_id,product_title,instant_Sellingprice from product where listing_type='FixedPrice'"

	console.log("Query is:" + getbuyableproducts);
	var resultSet = "";
	mysqlpool.execQuery(getbuyableproducts, '', function(err, results) {
		if (err) {
			console.log("Error while  fetching buyers from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			if (results.length > 0) {
				console.log("length" + results.length);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					userName : globals.usrName,
					result : resultSet,
					error : ''
				});

			}//if
			else // no results
			{
				var resultSet = JSON.stringify("No results found");
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					error : 'No resutls found',
					result : resultSet
				});
			}
		}//else
	});

}//listbuyableProduct

function listallProduct(req,res)
{
	 globals.checkifListAvailable(req,res,"listallProduct",globals.listavailable,productListunavailable,req.param("currentpage"));
  
}//getallbuyers

//list all product

function productListunavailable(req, res) {
	var getallproducts = " select product_id,product_title,instant_Sellingprice,listing_type from product ";

	console.log("Query is:" + getallproducts);
	var resultSet = "";
	mysqlpool.execQuery(getallproducts, '', function(err, results) {
		if (err) {
			console.log("Error while  fetching buyers from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			if (results.length > 0) {
				console.log("length" + results.length);
				resultSet = JSON.parse(JSON.stringify(results));
				
				globals.deletelist("listallProduct");
				globals.setval("listallProduct",results);
				
				// do pagination
				globals.getval(res,"listallProduct",0,globals.numEntries);
			}//if
			else // no results
			{
				var resultSet = JSON.stringify("No results found");
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					error : 'No resutls found',
					result : resultSet
				});
			}
		}//else
	});

}//listallProduct


//fetch buyer and seller bid, given a aproduct id

function getProductdetails(req, res) {
	var gettopfewproducts = " select product_id,product_title,instant_Sellingprice,listing_type from product limit 20";

	console.log("Query is:" + gettopfewproducts);
	var resultSet = "";
	mysqlpool.execQuery(gettopfewproducts, '', function(err, results) {
		if (err) {
			console.log("Error while  fetching buyers from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {

			if (results.length > 0) {
				console.log("length" + results.length);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					userName : globals.usrName,
					result : resultSet
				});

			}//if
			else // no results
			{
				var resultSet = JSON.stringify("No results found");
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					error : "No resutls found",
					result : resultSet
				});
			}
		}//else
	});

}//getProductdetails



//delete product
// product_id from front end
function deleteProduct(req,res){
	var deleteproduct="delete from product where product_id="+req.param("productid");
	console.log("Query is:"+deleteproduct);
	
	mysqlpool.execQuery(deleteproduct,'',function(err,results){
		if(err){
			console.log("Error while  deleteting Product in db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
    });
}//deleteProduct


//fetch top 20 products..
function fetchtopfewProduct(req, res) {
	var gettopfewproducts = " select product_id,product_title,instant_Sellingprice,listing_type from product limit 20";

	console.log("Query is:" + gettopfewproducts);
	var resultSet = "";
	mysqlpool.execQuery(gettopfewproducts, '', function(err, results) {
		if (err) {
			console.log("Error while  fetching buyers from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			if (results.length > 0) {
				console.log("length" + results.length);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					userName : globals.usrName,
					result : resultSet
				});

			}//if
			else // no results
			{
				var resultSet = JSON.stringify("No results found");
				console.log(resultSet);
				res.render('product', {
					title : 'Products',
					error : "No resutls found",
					result : resultSet
				});
			}
		}//else
	});
}//fetchtopfewProduct


exports.addtoCart = function (req,res) {
	 var pid = req.query.id;
	 var qty = req.query.qty;
	 var title = req.query.title;
	 var price = req.query.price;	 
	 if(qty == undefined)
		 qty = 1;
	 console.log("id : " + pid);
	 
	 var checkshoppingCart="select quantity from shoppingcart where product_id= "+ pid + " and buyer_id=" + globals.user_Id;
	 console.log("Query is:"+checkshoppingCart);
	 mysqlpool.execQuery(checkshoppingCart,'',function(err,results){
		if(err){
			console.log("Error while inserting into db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			if(results.length > 0){
				var p_qty = results[0].quantity + qty;
                var updateQuantity="UPDATE shoppingcart SET quantity=" + p_qty + " WHERE product_id="+ pid + " and buyer_id=" + globals.user_Id;
                console.log("Query is:"+updateQuantity);
                mysqlpool.execQuery(updateQuantity,'',function(err,results){
					if(err){
					    console.log("Error while inserting into db");
					    res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
					} else {
						res.redirect("/fetchfromCart");
					}
				});			
			} else {
				var addtocart="insert into shoppingcart (buyer_id,product_id,product_title,product_price,quantity) values ("+
				globals.user_Id +","+ pid +",'"+ title +"',"+ price +"," + qty + ")";
				console.log("Query is:"+addtocart);
				mysqlpool.execQuery(addtocart,'',function(err,results){
					if(err){
					    console.log("Error while inserting into db");
					    res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
					} else {
						res.redirect("/fetchfromCart");
					}
				});
			}
		}
	 });
};

exports.buynow = function (req,res) {
	 var pid = req.query.id;
	 var qty = req.query.qty;
	 var title = req.query.title;
	 var price = req.query.price;
	 var sum = 0;
	 
	 if(qty == undefined){
		 qty = 1;
		 sum = qty * price;
	 } else {
		 sum = qty * price;
	 }
	 
	 var json = "[{product_id :'" + pid + "',product_title :'" + title + "',quantity :'" + qty + "',price :'" + price + "',total :'" + sum + "'}]";
	
	 globals.cartRes = JSON.parse(JSON.stringify(eval("(" + json + ")")));
	 
	 res.render('paymentDetails', {title : 'payment/eBay', userName : globals.usrFName});
};

exports.fetchfromCart = function (req,res) {
	 var fetchfromcart="select product_id,product_title,product_price,quantity,product_price*quantity AS 'Sum' from  shoppingcart where buyer_id="+globals.user_Id;
	 
	 console.log("Query is:"+fetchfromcart);
	 mysqlpool.execQuery(fetchfromcart,'',function(err,results){
		if(err){
			console.log("Error while fetching from db for cart");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}else{
			if(results.length > 0){
				var total = 0;
				var len = results.length;
				console.log("length"+results.length);	
				resultSet = JSON.parse(JSON.stringify(results));
				while(len > 0){
					total += resultSet[len-1].Sum;
					len--;
				}
				console.log(resultSet);
				res.render('shoppingCart', { title: 'shoppingCart', userName : globals.usrFName, error : "", result : resultSet, tot : total});
			}//if
			else // no results
			{
				var resultSet = JSON.stringify("No results found");
				console.log(resultSet);
				res.render('shoppingCart', { title : 'shoppingCart', userName : globals.usrFName, error : "No results found", result : resultSet, tot : ''});
			}
		}//else
	 });
};

//Delete from cart
exports.deletefromCart = function (req,res) {
	var deletefromCart="delete from shoppingcart where buyer_id="+globals.user_Id +" and product_id="+req.query.id;
	
	console.log("Query is:"+deletefromCart);
	
	mysqlpool.execQuery(deletefromCart,'',function(err,results){
		if(err){
			console.log("Error while  deleteting Product from Shopping Cart");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else
			{
			res.redirect("/fetchfromCart");
			//res.render('shoppingCart', { title : 'shoppingCart', userName : globals.usrFName, error : "No results found", result : resultSet});;
			}
    });
};

//Fetch Product Detail
exports.fetchProductDetail = function(req,res){
	//<a href="fetchProductDetail?product_id=<%= resp.product_id%>&product_title=<%= resp.product_title%>&product_condition=<%= resp.product_condition%>&category=<%= resp.category%>&subcategory=<%= resp.subcategory%>&available_quantity=<%= resp.available_quantity%>&product_description=<%= resp.product_description%>&instant_sellingprice=<%= resp.instant_sellingprice%>&listing_type=<%= resp.listing_type%>">
	
	var product_id=req.query.product_id;
	var auction_id=req.query.auction_id;
	var product_title=req.query.product_title;
	var product_condition=req.query.product_condition;
	var category=req.query.category;
	var subcategory=req.query.subcategory;
	var available_quantity=req.query.available_quantity;
	var product_description=req.query.product_description;
	var instant_sellingprice=req.query.instant_sellingprice;
	var listing_type=req.query.listing_type;
	
	var isUpdate = req.query.isUpdate;
	
	if(isUpdate === "yes")
	{
		res.render('adminUpdateProduct', { title: 'Admin/UpdateProduct', userName : globals.usrFName, product_id:product_id, product_title:product_title,product_condition:product_condition,category:category,subcategory:subcategory,available_quantity:available_quantity,product_description:product_description,instant_sellingprice:instant_sellingprice,listing_type:listing_type});
	}else
	{
		res.render('productDetail', { title: 'ProductDetail/ebay', userName : globals.usrFName, product_id:product_id, auction_id : auction_id, product_title:product_title,product_condition:product_condition,category:category,subcategory:subcategory,available_quantity:available_quantity,product_description:product_description,instant_sellingprice:instant_sellingprice,listing_type:listing_type});
	}
};

exports.listallProduct = listallProduct;
exports.searchProduct = searchProduct;
exports.deleteProduct = deleteProduct;
exports.listauctioableProduct = listauctioableProduct;
exports.listbuyableProduct = listbuyableProduct;