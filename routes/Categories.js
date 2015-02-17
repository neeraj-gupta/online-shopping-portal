/**
 * New node file
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var mysqlpool = require('./dbConnection/mysqlQuery');
var globals = require('./globals');

function fetchCategories(req,res)
{
	
	var getCategories="select distinct(category) from product";

	console.log("Query is:"+getCategories);
	
	mysqlpool.execQuery(getCategories,'',function(err,results){
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
		
	});

	
}//fetchCategories


//  'category' from front end

function fetchSubcategories(req,res)
{
	var getSubCategories="select distinct(subcategory) from product where category = '"+req.param("category")+"'";

	console.log("Query is:"+getSubCategories);
	
	mysqlpool.execQuery(getSubCategories,'',function(err,results){
		if(err){
			console.log("Error while fetching data");
			throw err;
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
		
	});
	
	
}//fetchSubcategories

exports.fetchCategories = fetchCategories;
exports.fetchSubcategories = fetchSubcategories;