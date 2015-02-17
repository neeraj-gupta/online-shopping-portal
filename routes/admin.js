
var ejs = require("ejs");
var mysql = require('./mysql');
var squel = require('squel');
var globals = require('./globals');
var mysqlpool = require('./dbConnection/mysqlQuery');

//listallProduct
function productListunavailable(req,res){
	var getproducts = " select * from product"	
    console.log("Query is:"+getproducts);
	var resultSet="";
	mysqlpool.execQuery(getproducts,'',function(err,results){
		if(err){
			console.log("Error while  fetching buyers from db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			if(results.length > 0){
				console.log("length"+results.length);	
				resultSet = JSON.parse(JSON.stringify(results));
				//console.log(resultSet);
				console.log("In adminProduct");
				
				globals.deletelist("listallProduct");
				globals.setval("listallProduct",results);
				
				// do pagination
				globals.listavailable(res,results.length,1,"listallProduct");
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				//console.log(resultSet);
				res.render('adminProduct', { title : 'Admin/Products', error : "No Results found!" ,result: resultSet,userName:"Admin"});
			}
		}//else
  });
	
	
}//listallProduct*/


function listallProduct(req,res)
{
	 var currentpage = req.query.currentpage;
	 if(currentpage == undefined || currentpage == '')
		 currentpage = 1;
	 console.log("page : " + currentpage);
	 globals.checkifListAvailable(req,res,"listallProduct",globals.listavailable,productListunavailable,currentpage);
  
}//getallbuyers

//list all person

function personListunavailable(req,res)
{
	var getallperson="select memberid,firstname,lastname,address,city,state,country,zipcode,emailaddr from person where admin='no'";

	console.log("Query is:"+getallperson);
	var resultSet="";
	mysqlpool.execQuery(getallperson,'',function(err,results){
		if(err){
			console.log("Error while  fetching Person from db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In adminPerson");
				globals.deletelist("listallperson");
				globals.setval("listallperson",results);
				
				// do pagination
				globals.listavailable(res,results.length,1,"listallperson");
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('adminPerson', { title : 'Admin/Person', error : "No Results found!" ,result: resultSet,userName:"Admin"});
			}
		}//else		
    });
	
}//list all person

function listallPerson(req,res)
{
	 var currentpage = req.query.currentpage;
	 if(currentpage == undefined || currentpage == '')
		 currentpage = 1;
	 globals.checkifListAvailable(req,res,"listallperson",globals.listavailable,personListunavailable,currentpage);
	
}//getallperson

//list all buyers

function listallbuyers(req,res)
{

	var getallbuyers = "select buyerid,buyerfirstname,buyerlastname,product_title,buying_time from buyer"
   
   console.log("Query is:"+getallbuyers);
	var resultSet="";
	mysqlpool.execQuery(getallbuyers,'',function(err,results){
		if(err){
			console.log("Error while  fetching buyers from db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In adminBuyer");
				
				res.render('adminBuyer', { title: 'Admin/Buyer', error : "", result : resultSet,userName:"Admin"});
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('adminBuyer', { title : 'Admin/Buyer', error : "No Results found!" ,result: resultSet,userName:"Admin"});
			}
		}//else
    });
	
}//list all buyers



//list all sellers

function sellersListunavailable(req,res)
{
	var getallbuyers = "select sellerid,sellerfirstname, sellerlastname,product_title,selling_time  from seller;" 
	   
   console.log("Query is:"+getallbuyers);
	var resultSet="";
	mysqlpool.execQuery(getallbuyers,'',function(err,results){
		if(err){
			console.log("Error while  fetching sellers from db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In adminSeller");
				globals.deletelist("listallsellers");
				globals.setval("listallsellers",results);
				
				// do pagination
				globals.listavailable(res,results.length,1,"listallsellers");
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('adminSeller', { title : 'Admin/Seller', error : "No Results found!" ,result: resultSet, userName:"Admin"});
			}
		}//else
    });
	
}//listallsellers


function listallsellers(req,res)
{
	 var currentpage = req.query.currentpage;
	 if(currentpage == undefined || currentpage == '')
		 currentpage = 1;
	 globals.checkifListAvailable(req,res,"listallsellers",globals.listavailable,sellersListunavailable,currentpage);
	
}//getallperson

function auctionsListunavailable(req,res)
{
	var getallAuction="select * from auction_report_view;";

	console.log("Query is:"+getallAuction);
	mysqlpool.execQuery(getallAuction,'',function(err,results){
		if(err){
			console.log("Error while fetching data");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				globals.deletelist("listallauctions");
				globals.setval("listallauctions",results);
				
				// do pagination
				globals.listavailable(res,results.length,1,"listallauctions");
				console.log("In adminAuctions");
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('adminAuctions', { title : 'Admin/Auctions', error : "No Results found!" ,result: resultSet, userName:"Admin"});
			}
		}//else
		
	});
}

function listallauctions(req,res)
{
	 var currentpage = req.query.currentpage;
	 if(currentpage == undefined || currentpage == '')
		 currentpage = 1;
	 globals.checkifListAvailable(req,res,"listallauctions",globals.listavailable,auctionsListunavailable,currentpage);
	
}//getallperson

function deletefromtable(req,res){
	
	var id = req.query.id;
	var tableName = req.query.tableName;
	console.log("Id" +id);
	console.log("TableName" +tableName);
	var deleteData = '';
	if(tableName == "product")
	{
		deleteData = "delete from product where product_id="+id;
	}else if(tableName == "seller")
	{
		deleteData = "delete from buyer where sellerid="+id;
	}else if(tableName == "buyer")
	{
		deleteData = "delete from buyer where buyerid="+id;
	}else if(tableName == "person")
	{
		deleteData = "delete from person where admin='no' and memberid="+id;
	}

	mysqlpool.execQuery(deleteData,'',function(err,results){
		if(err){
			console.log("Error while  deleteting Product in db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}else
		{
			if(tableName == "product")
			{
				productListunavailable(req,res);
			}else if(tableName == "buyer")
			{
				listallbuyers(req,res);
			}else if(tableName == "seller")
			{
				sellersListunavailable(req,res);
			}else if(tableName == "person")
			{
				personListunavailable(req,res);
			}
		}
    });
} 

function updateProduct(req, res) {
	var updateproduct = "update product set product_title ='"
		+ req.param("product_title") + "',product_condition ='"
		+ req.param("product_condition") + "',category='"
		+ req.param("category") + "',subcategory ='"
		+ req.param("subcategory") + "',available_quantity ='"
		+ req.param("available_quantity") + "',product_description='"
		+ req.param("product_description") + "',instant_sellingprice="
		+ req.param("instant_sellingprice") 
		//+ ",listing_type='"
	//	+ req.param("listing_type") + "'" 
		+ " where product_id="
		+ req.param("product_id");

	console.log("Query is:" + updateproduct);

	mysqlpool.execQuery(updateproduct, '', function(err, results) {
		if (err) {
			console.log("Error while updating Product into db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}else
		{
			productListunavailable(req,res);
		}
	});

}//updateProduct


//list all listbuyersofProduct

function listbuyersofProduct(req,res)
{
	var product_id = req.query.product_id;
 	var getallbuyersofproduct = "select buyerfirstname,buyerlastname,product_title,buying_time from buyer where product_id ="+product_id;
   
    console.log("Query is:"+getallbuyersofproduct);
	
	mysqlpool.execQuery(getallbuyersofproduct,'',function(err,results){
		if(err){
			console.log("Error while  fetching buyers from db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In admin buyer of a product");
				res.render('adminBuyersOfProduct', { title: 'Admin/adminBuyersOfProduct', error : "", result : resultSet,userName:"Admin"});
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('adminBuyersOfProduct', { title : 'Admin/adminBuyersOfProduct', error : "No Results found!" ,result: resultSet,userName:"Admin"});
			}
		}//else
    });
	
}//listbuyersofProduct

//list all listallsellersofProduct

function listsellersofProduct(req,res)
{
	var product_id = req.query.product_id;
	var getallsellersofproduct = "select sellerfirstname,sellerlastname,product_title, selling_time from seller where product_id ="+product_id;
 
   console.log("Query is:"+getallsellersofproduct);
	
	mysqlpool.execQuery(getallsellersofproduct,'',function(err,results){
		if(err){
			console.log("Error while  fetching sellers from db");
			res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In admin seller of a product");
				res.render('adminSellersOfProduct', { title: 'Admin/adminSellersOfProduct', error : "", result : resultSet,userName:"Admin"});
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('adminSellersOfProduct', { title : 'Admin/adminSellersOfProduct', error : "No Results found!" ,result: resultSet,userName:"Admin"});
			}
		}//else
  });
	
}//listsellersofProduct


function adminSearchPerson(req,res)
{
	res.render('adminSearchPerson', { title : 'Admin/AdminSearchPerson', userName:"Admin"});
}

//function searchPerson (firstname, lastname, emailaddr,city, state, country)
//dint convert to lower coz it will reduce the performance.. can add it later if needed

function searchPerson(req,res)
{ 
	// check if user is admin
var firstname=req.param("firstname");
var lastname=req.param("lastname");
var city=req.param("city");
var state=req.param("state");
var country=req.param("country");
var zipcode=req.param("zipcode");


	var searchperson=squel.select()
	.field("firstname")
	.field("lastname")
	.field("address")
	.field("country")
	.from("person")
	
	if(firstname!=='' && firstname!=undefined)
		searchperson.where("firstname='"+firstname+"'")
	if(lastname!=='' && lastname != undefined )
		searchperson.where("lastname='"+lastname+"'")
	if(zipcode!=='' && zipcode!= undefined )
		searchperson.where("zipcode='"+zipcode+"'")
	if(city!=='' && city != undefined)
		searchperson.where("city='"+city+"'")
	if(state!=='' && state!=undefined)
		searchperson.where("state='"+state+"'")
	if(country!=='' && country!=undefined )
		searchperson.where("country='"+country+"'")
		
		searchperson+='\0';
	
	console.log("Query is:"+searchperson);
	var data= false;
		globals.exportclient().hmget("searchPerson", searchperson,function(error, result) {
		    if (error){ 
		    	console.log('Error: '+ error);
		    	res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		    } else {
		    	  console.log('value--------- ' + result);
		    	  data=result;
		    	  
		    	  //if(data!==false && data !== undefined  && data!='')
		          //{
		    	  if(data!==false && data !== undefined  && data !=='' && data.length > 10)
		          {
		    		console.log("+++++"+result);
		    		data = JSON.parse(result);
		    	  
		    	  
		    		  
			    		//data cached already
						console.log(data);
			    		console.log("cached");
			    		res.render('searchPersonResults', { title: 'Admin/SearchPersonResults', error : "", result : data,userName:"Admin"});
			    		//res.jsonp(data);	
		          }		
		    	else{
		    	
		    			mysqlpool.execQuery(searchperson,'',function(err,results){
		    				if(err){
		    					console.log("Error while fetching data");
		    					res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		    				}
		    				else 
		    				{
		    					
		    					var json='';
		    					if(results.length > 0){	
		    						json=JSON.stringify(results);
		    						var resultSet = JSON.parse(JSON.stringify(results));
		    						console.log(resultSet);
		    					
		    						globals.exportclient().hdel("searchPerson",searchperson);
		    						globals.exportclient().hmset("searchPerson",searchperson,json);
		    						res.render('searchPersonResults', { title: 'Admin/SearchPersonResults', error : "", result : resultSet,userName:"Admin"});
		    						
		    					}//if
		    					else // no results
		    					{
		    						var resultSet=JSON.stringify("No results found");
		    						console.log(resultSet);
		    						res.render('searchPersonResults', { title : 'Admin/SearchPersonResults', error : "No Results found!" ,result: resultSet,userName:"Admin"});
		    					}
		    				}//else
		    				
		    			});
		    	}//else // data not cached 	  
		    	  
		    }//else hmget
		});
		
	
}//searchPerson


exports.searchPerson = searchPerson;
exports.adminSearchPerson = adminSearchPerson;
exports.deletefromtable=deletefromtable;
exports.listallauctions=listallauctions;
exports.listallsellers=listallsellers;
exports.listallbuyers=listallbuyers;
exports.listallProduct=listallProduct;
exports.listallPerson=listallPerson;
exports.updateProduct=updateProduct;
exports.listbuyersofProduct=listbuyersofProduct;
exports.listsellersofProduct=listsellersofProduct;
