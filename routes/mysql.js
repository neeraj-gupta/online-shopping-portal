
var ejs= require('ejs');
var mysql = require('mysql');
//var generic_pool = require('generic-pool'); 
var pool = require('./dbConnection/mysqlConn');

/*function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'ebay'
	});
	console.log("created new connection")
	return connection;
}



var pool = generic_pool.Pool({  
  
    name: 'mysql',  
    max: 10,
    create: function(callback) {  
        var Client = require('mysql').createConnection({  
            host:'localhost',  
            user:'root',  
            password:'',  
            database: 'ebay'  
        });    
        callback(null,Client);  
  
    },  
  
    destroy: function(db) {  
        //db.disconnect();  
    }  
});  
*/

function fetchData(callback,sqlQuery){
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.acquire(function(err, client) {  
	    if (err) { 
	    	console.log("my error");
	    	console.log("ERROR: " + err.message);
	    }  
	  
	    else {  
	    	console.log("else");
	        client.query(sqlQuery, [], function(err,data) {  
	            console.log(data);  
	            callback(err,data);  
	            pool.release(client);  
	        });  
	    }  
	});  

}	

function insertData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.acquire(function(err, client) {  
	    if (err) {  
	    	console.log("ERROR: " + err.message);
	    }  
	  
	    else {  
	        client.query(sqlQuery, [], function(err,data) {  
	            console.log(data);  
	            callback(err,data);  
	            pool.release(client);  
	        });
	    }
	});
	
}




exports.fetchData=fetchData;
exports.insertData=insertData;
