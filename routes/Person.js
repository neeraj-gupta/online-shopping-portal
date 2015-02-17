/**
 * New node file
 */

var ejs = require("ejs");
var mysql = require('./mysql');
var squel = require('squel');
var mysqlpool = require('./dbConnection/mysqlQuery');
var globals = require('./globals');


//function updatePerson(firstname,lastname,address, city, state, country,zipcode, emailaddr, password, payement_type, payement_accno,memberid)

function updatePerson(req,res)
{
	var updateperson="update person set firstname ='"+req.param("firstname")+"',lastname ='"+req.param("lastname")+"',address='"+
	req.param("address")+"',city ='"+ req.param("city")+"',state ='"+req.param("state")+"',country='"+req.param("country")+
	"',zipcode="+req.param("zipcode")+" where memberid="+globals.user_Id;

	console.log("Query is:"+updateperson);
	
	mysqlpool.execQuery(updateperson,'',function(err,results){
		if(err){
			console.log("Error while inserting update Person into db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}else
		{
			fetchPersonDetails(req,res);
		}
    });
	
}//updatePerson


//memberid - from front end

function deletePerson(req,res)
{
	var deleteperson="delete from person where memberid="+req.param("memberid");

	console.log("Query is:"+deleteperson);
	
	mysqlpool.execQuery(deleteperson,'',function(err,results){
		if(err){
			console.log("Error while  deleteting Person in db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
    });
	
}//deleteperson

//function searchPerson (firstname, lastname, emailaddr,city, state, country)
//dint convert to lower coz it will reduce the performance.. can add it later if needed

function searchPerson(req,res)
{
	// check if user is admin
    var firstname=req.param("firstname");
    var lastname=req.param("lastname");
    var emailaddr=req.param("emailaddr");
    var city=req.param("city");
    var state=req.param("state");
    var country=req.param("country");
    
    
	var searchperson=squel.select()
	.field("memberid")
	.field("firstname")
	.field("lastname")
	.field("emailaddr")
	.from("person")
	
	if(firstname!=='')
		searchperson.where("firstname='"+firstname+"'")
	if(lastname!=='')
		searchperson.where("lastname='"+lastname+"'")
	if(emailaddr!=='')
		searchperson.where("emailaddr='"+emailaddr+"'")
	if(city!=='')
		searchperson.where("city='"+city+"'")
	if(state!=='')
		searchperson.where("state='"+state+"'")
	if(country!=='')
		searchperson.where("country='"+country+"'")
		
		searchperson+='\0';
	
	console.log("Query is:"+searchperson);
	
	mysqlpool.execQuery(searchperson,'',function(err,results){
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
			else // no results
			{
			json=JSON.stringify("No results found");
			console.log(json);
			res.jsonp(json);
			
			}
		}//else
		
	});
 
}//searchPerson


//getallperson

function listallPerson(req,res)
{
	var getallperson="select firstname,lastname,address,city,state,country,zipcode,emailaddr from person";

	console.log("Query is:"+getallperson);
	
	mysqlpool.execQuery(getallperson,'',function(err,results){
		if(err){
			console.log("Error while  fetching Person from db");
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
			else // no results
			{
			json=JSON.stringify("No results found");
			console.log(json);
			res.jsonp(json);
			
			}
		}//else
		
    });
	
}//getallperson


//list all buyers

function listallbuyers(req,res)
{
	
  // var getallbuyers = " select a.firstname,a.lastname, b.product_title  from person a, product b, buyer c " +
   //"where b.product_id = c.product_id and c.buyerid=a.memberid";
	
	var getallbuyers = " select firstname,lastname,productname from buyer"
   
   console.log("Query is:"+getallbuyers);
	
	mysqlpool.execQuery(getallbuyers,'',function(err,results){
		if(err){
			console.log("Error while  fetching buyers from db");
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
			else // no results
			{
			json=JSON.stringify("No results found");
			console.log(json);
			res.jsonp(json);
			
			}
		}//else
    });
	
}//getallbuyers




//list all sellers

function listallsellers(req,res)
{
	
	
  // var getallbuyers = " select a.firstname,a.lastname, b.product_title  from person a, product b, seller  c " +
   //"where b.product_id = c.product_id and c.sellerid=a.memberid";
	
	var getallsellers = " select firstname,lastname,productname from seller"
   
   console.log("Query is:"+getallsellers);
	
	mysqlpool.execQuery(getallsellers,'',function(err,results){
		if(err){
			console.log("Error while  fetching sellers from db");
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
			else // no results
			{
			json=JSON.stringify("No results found");
			console.log(json);
			res.jsonp(json);
			
			}
		}//else
    });
	
}//listallsellers

function sellingHistory(req,res)
{
	var sellinghistory = "select a.product_title,c.category,c.instant_sellingprice from seller a , person b, product c where a.sellerid="+globals.user_Id+" and a.sellerid=b.memberid and a.product_id= c. product_id";
    console.log("Query is:"+sellinghistory);
	
	mysqlpool.execQuery(sellinghistory,'',function(err,results){
		if(err){
			console.log("Error while  fetching sellers from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In sellinghistory");
				res.render('sellingHistory', { title: 'Ebay/SellingHistory', error : "", result : resultSet,firstName:globals.usrFName, address:globals.address,lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, userId:globals.user_Id});
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('sellingHistory', { title : 'Ebay/SellingHistory', error : "No Results found!" ,result : resultSet,firstName:globals.usrFName, address:globals.address,lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, userId:globals.user_Id});
			}
		}//else
    });
	
}//sellingHistory

//given a person id give both wat he has  bought.. 

function buyingHistory(req,res)
{
	var buyinghistory = "select a.product_title,c.instant_sellingprice, c.category from buyer a , person b, product c where a.buyerid="+globals.user_Id+" and a.buyerid=b.memberid and a.product_id= c. product_id";
    console.log("Query is:"+buyinghistory);
	
	mysqlpool.execQuery(buyinghistory,'',function(err,results){
		if(err){
			console.log("Error while  fetching buyer from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In buyingHistory");
				res.render('buyingHistory', { title: 'Ebay/BuyingHistory', error : "", result : resultSet,firstName:globals.usrFName, address:globals.address,lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, userId:globals.user_Id});
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('buyingHistory', { title : 'Ebay/BuyingHistory', error : "No Results found!" ,address:globals.address,result : resultSet,firstName:globals.usrFName, lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, userId:globals.user_Id});
			}
		}//else
    });
	
}//buyinghistory

//Fetch person details
function fetchPersonDetails(req,res)
{
	var isUpdate = req.query.isUpdate;
	var personDetails="select * from person where memberid="+globals.user_Id;
		 
		 console.log("Query is:"+personDetails);
		 mysqlpool.execQuery(personDetails,'',function(err,results){
			if(err){
				console.log("Error while fetching from db for cart");
				res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
			}else{
				if(results.length > 0){
					console.log("length"+results.length);	
					var resultSet = JSON.parse(JSON.stringify(results));
					globals.usrFName = resultSet[0].firstname;
					globals.usrLName = resultSet[0].lastname;
					globals.address =  resultSet[0].address;
					globals.city =  resultSet[0].city;
					globals.state =  resultSet[0].state;
					globals.country =  resultSet[0].country;
					globals.zipcode =  resultSet[0].zipcode;
					console.log(resultSet);
					if(isUpdate == "yes")
					{
						res.render('updateProfile', { title: 'Ebay/UpdateProfiel', error : "", firstName:globals.usrFName, lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, address:globals.address ,userId:globals.user_Id});
					}else
					{
						res.render('userProfile', { title: 'Ebay/PersonDetails', error : "", firstName:globals.usrFName, lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, address:globals.address ,userId:globals.user_Id});
					}
				}//if
				else // no results
				{
					var resultSet=JSON.stringify("No results found");
					console.log(resultSet);
					if(isUpdate == "yes")
					{
						res.render('updateProfile', { title: 'Ebay/UpdateProfiel', error : "", firstName:globals.usrFName, lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, address:globals.address ,userId:globals.user_Id});
					}else
					{
						res.render('userProfile', { title: 'Ebay/PersonDetails', error : "", firstName:globals.usrFName, lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, address:globals.address ,userId:globals.user_Id});
					}
				}
			}//else
	});	  
	
	
	
}

//given a person id give both wat he has  bid.. 

function biddingHistory(req,res)
{
	
	var biddinghistory = "select a.product_title, b. bid_price,b. bid_time from product a, bid b where a.product_id=b.product_id and b.bidid="+globals.user_Id;
    console.log("Query is:"+biddinghistory);
	mysqlpool.execQuery(biddinghistory,'',function(err,results){
		if(err){
			console.log("Error while  fetching buyer from db");
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		}
		else 
		{
			if(results.length > 0){
				console.log("length"+results.length);	
				json=JSON.stringify(results);
				resultSet = JSON.parse(JSON.stringify(results));
				console.log(resultSet);
				console.log("In biddingHistory");
				res.render('biddingHistory', { title: 'Ebay/BiddingHistory', error : "", result : resultSet,firstName:globals.usrFName, address:globals.address,lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, userId:globals.user_Id});
				
			}//if
			else // no results
			{
				var resultSet=JSON.stringify("No results found");
				console.log(resultSet);
				res.render('biddingHistory', { title : 'Ebay/BiddingHistory', error : "No Results found!" ,result : resultSet,firstName:globals.usrFName, address:globals.address,lastName:globals.usrLName,city:globals.city,state:globals.state,country:globals.country,zipcode:globals.zipcode,userName:globals.usrFName, userId:globals.user_Id});
			}
		}//else
    });
	
}//biddinghistory


exports.fetchPersonDetails= fetchPersonDetails;
exports.sellingHistory= sellingHistory;
exports.buyingHistory= buyingHistory;
exports.biddingHistory= biddingHistory;
exports.updatePerson = updatePerson;
exports.deletePerson = deletePerson;
exports.searchPerson = searchPerson;
exports.listallPerson = listallPerson;
exports.listallbuyers = listallbuyers;
exports.listallsellers = listallsellers;  

