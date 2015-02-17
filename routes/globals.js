var usrFName = '';
var usrLName = '';
var address='';
var city='';
var state='';
var country='';
var zipcode='';
var email = '';
var lastLogin = '';
var user_Id = '';
var queryString = '';
var resultSet = '';
var cartRes = '';
var Auth = false;
var numEntries = 12;

var redis = require("redis"),
client = redis.createClient();

exports.exportclient = function(){
  return client;	
}

exports.getval = function (res,name,startindex,endindex,currentPage) {
	
	client.on("error", function (err) {
        console.log("Error in Redis	client " + err);
    });
	  
	client.lrange(name, startindex, endindex, function (error, results) {
		  if (error)
		  {
			  console.log("Er : " + error);
			  res.render('errorAdmin', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		  }else
		  {
			  	console.log('Name:' + name);
			  if(results.length > 0){
					console.log("length  "+results.length);	
					var resultSet = results;//JSON.parse(JSON.stringify(results));
					resultSet = [];
					for(i=0;i<results.length;i++) {
						resultSet.push(JSON.parse(results[i]));
					}
					
					//console.log(resultSet);
					
					if(name == "listallProduct")
					{
						console.log("In adminProduct");
						
						res.render('adminProduct', { title: 'Admin/Products', error : "", result : resultSet, userName:'Admin', currentpage:currentPage});
					}else if(name == "listallperson")
					{
						console.log("In adminPerson");
						res.render('adminPerson', { title: 'Admin/Person', error : "", result : resultSet,userName:'Admin',currentpage:currentPage});
					}else if(name == "listallsellers")
					{
						console.log("In adminSeller");
						res.render('adminSeller', { title: 'Admin/Seller', error : "", result : resultSet, userName:'Admin',currentpage:currentPage});
					}else if(name == "listallauctions")
					{
						console.log("In adminAuction");
						res.render('adminAuctions', { title: 'Admin/Auctions', error : "", result : resultSet, userName:'Admin',currentpage:currentPage});
					}					
					
				}//if
				else // no results
				{
					var resultSet=JSON.stringify("No results found");
					console.log(resultSet);
					if(name == "listallProduct")
					{
						console.log("In adminProduct");
						res.render('adminProduct', { title : 'Admin/Products', error : "No Results found!" ,result: resultSet,userName:'Admin',currentpage:currentPage});
					}else if(name == "listallperson")
					{
						console.log("In adminPerson");
						res.render('adminPerson', { title : 'Admin/Person', error : "No Results found!" ,result: resultSet,userName:'Admin',currentpage:currentPage});
					}else if(name == "listallsellers")
					{
						console.log("In adminSeller");
						res.render('adminSeller', { title : 'Admin/Seller', error : "No Results found!" ,result: resultSet, userName:'Admin',currentpage:currentPage});
					}else if(name == "listallauctions")
					{
						console.log("In adminAuction");
						res.render('adminAuctions', { title : 'Admin/Auctions', error : "No Results found!" ,result: resultSet, userName:'Admin',currentpage:currentPage});	
					}		
				}  
		  }  
	}); 
};

exports.setval = function (name,results) {
	client.on("error", function (err) {
        console.log("Error in Redis	client " + err);
    });
	
	for ( i=0 ; i<results.length; i++) 
		client.rpush(name, JSON.stringify(results[i]));
	
};

exports.checkifListAvailable = function (req,res,listname,isPresentCallback, loadCacheCallback,currentpage) {
	client.on("error", function (err) {
        console.log("Error in Redis	client " + err);
    });
	
	var length = 0;

	client.llen(listname,function(err,data) {
		length=data;
		console.log(" length  : "+length);
		if(length > 0) {
			console.log("page no : " + currentpage)
			isPresentCallback(res,length,currentpage,listname);
		}else {
			loadCacheCallback(req,res);
		}
	});
};


exports.listavailable = function (res,length,currentPage,listname)
{
	

	//var listLength = length
	var startindex=0;
	
	var pages = 0
	console.log();
	var lastPageEntries = length % numEntries;  
	if(length < numEntries )     // length < num of enteries per page ,  only 1  page
		{
		console.log("only 1 page");
		pages = 1;
		endindex=length;
		}
	else {
		
		//to calculate num of pages
		if(lastPageEntries > 0 )              //  last page entry >0 but less than 10.
			pages = length/numEntries + 1;
		else                                   // page contains exactly 10 items. 
			pages = length/numEntries;
		
		// to caculate start and end index
		startindex=((currentPage-1)*(numEntries));
		if(currentPage==pages) // last page
			{
			  console.log(" last page ");
			  endindex= lastPageEntries;
			}
		else{
			  console.log(" each page ");
			  endindex= startindex + (numEntries -1 ) ;
			}
	} 
	
	console.log("start index : "+startindex+" end index : "+endindex);
	exports.getval(res,listname,startindex,endindex,currentPage);
}


exports.deletelist = function (name) {
	
	client.on("error", function (err) {
        console.log("Error in Redis	client " + err);
    });
	
    console.log("deleting list ");
	client.del(name);
	
};