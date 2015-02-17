var globals = require('./globals');
var mysqlpool = require('./dbConnection/mysqlQuery');

exports.index = function(req, res){
	globals.queryString = "select * from product_view LIMIT 30";
	console.log("Query is : " + globals.queryString);
	
	// Connection Poling Call
	mysqlpool.execQuery(globals.queryString,'',function(err,results){
		if(err){
			throw err;
		} else {
			globals.resultSet = JSON.parse(JSON.stringify(results));
			res.render('index', { title: 'eBay', result : globals.resultSet });
		}
	});
};

exports.home = function(req, res){
	res.render('userHome', { title: 'eBay/Home', userName : globals.usrFName ,result : globals.resultSet });
};

exports.adminHome = function(req, res){
	res.render('admin', { title: 'Admin/eBay', userName : 'Admin' });
};