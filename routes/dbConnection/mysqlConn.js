
var mysql_pool = require('mysql');
var pool  = mysql_pool.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'Neeru',
	port     : '3306',
	database : 'ebay',
	connectionLimit : '10'
});

exports.pool = pool;
