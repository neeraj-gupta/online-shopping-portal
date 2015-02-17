/**
 * New node file
 */
var ejs = require("ejs");

var mysqlpool = require('./dbConnection/mysqlQuery');

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

function insertdata() {

	var productdata = "select * from product";
	
	   console.log("Query is:"+productdata);
		
		mysqlpool.execQuery(productdata,'',function(err,prodresults){
			if(err){
				console.log("Error while  fetching from db");
				throw err;
			}
			else 
			{
					console.log("prodresults length"+prodresults.length);	
					
					var persondata= " select * from person";
					
					mysqlpool.execQuery(persondata,'',function(err,personresults){
						if(err){
							console.log("Error while  fetching from db");
							throw err;
						}
						else
							{
							   var j=0;
								for(var i=0;i<prodresults.length;i++)
								{
									
									
									 var insertseller="insert into seller (product_id,sellerid,selling_time,sellerfirstname,sellerlastname,product_title) values ("+
									 prodresults[i].product_id+ ","+personresults[j].memberid+",now(),'"+personresults[j].firstname+"','"+
									 personresults[j].lastname+"','"+mysql_real_escape_string(prodresults[i].product_title)+"')";
									  console.log("Query is:"+insertseller);
									  
									 
									 mysqlpool.execQuery(insertseller,'',function(err,sellerres){
										if(err){
											console.log("Error while inserting into db");
											throw err;
										   }
									 });
									
									 
									 if(prodresults[i].listing_type=='auction')
										 {
										 
										 
											
											var createAuction = "insert into auction (seller_id,product_id,auction_starting_date,auction_end_date,auction_starting_price,current_price) values ("+
											personresults[j].memberid+","+prodresults[i].product_id+", now(),'2014-12-9 7:30:21'," +prodresults[i].instant_sellingprice+","+prodresults[i].instant_sellingprice+")";
											
											console.log("Query is:" + createAuction);
										
											mysqlpool.execQuery(createAuction,'',function(err,results){
											if(err){
												console.log("Error while inserting into db");
												throw err;
												}
											});
										 
										 }
									 
									 
									 
									j++;
									if(j==personresults.length)  j=0;
									 
								}//for product
							}//else person
					});//perosn
			}//else product
	    });//product
	
	
	
}//bidproduct



exports.insertdata = insertdata;
