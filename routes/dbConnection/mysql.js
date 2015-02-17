var ejs = require('ejs');
var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
		host     : 'localhost',
	    user     : 'root',
	    password : 'Neeru',
	    database : 'ebay'
	});
	return connection;
}

var connectParam = {
	host     : 'localhost',
    user     : 'root',
    password : 'Neeru',
    database : 'ebay'
};

exports.fetchData = function(callback, sqlQuery){
	console.log("\nSQL Query:: " + sqlQuery);
	var connection = getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		} else {	// return err or result
			console.log('Rows : ' + rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};

exports.insertData = function(callback, sqlQuery){
	console.log("\nSQL Query :: " + sqlQuery);
	var connection = getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		} else {	// return err or result
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};