var ejs = require("ejs");
var globals = require('./globals');
var mysqlpool = require('./dbConnection/mysqlQuery');
var mysql_without_pool = require('./dbConnection/mysql');


// Without ConnectionPooling Login
exports.afterSignIn = function (req,res){
	var user = req.param("inputEmail");
	var pwd = req.param("inputPwd");
	var cols = [];
	if(user !== null){
		globals.queryString = "SELECT * FROM person WHERE emailaddr = '" + user + "'";
		console.log("Query is : " + globals.queryString);
		
		// Connection Poling Call
		mysql_without_pool.fetchData(function(err,results){
			if(err){
				res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
			} else {
				if(results.length > 0){
					var resultStr = JSON.parse(JSON.stringify(results));
					if(resultStr[0].password === pwd){
						globals.Auth = true;
						globals.usrFName = resultStr[0].firstname;
						globals.usrLName = resultStr[0].lastname;
						globals.address =  resultStr[0].address;
						globals.city =  resultStr[0].city;
						globals.state =  resultStr[0].state;
						globals.country =  resultStr[0].country;
						globals.zipcode =  resultStr[0].zipcode;
						globals.email = resultStr[0].emailaddr;
						globals.lastLogin = resultStr[0].lastlogin;
						globals.user_Id = resultStr[0].memberid;
						var admin = resultStr[0].admin;
						if(admin == 'no')
							res.render('userHome', { title: 'DashBoard/eBay', userName : globals.usrFName, result : globals.resultSet, userId:globals.user_Id});
						else
							res.render('admin', { title: 'Admin/eBay', userName : 'Admin'});
					} else {
						console.log("Invalid Login password");
						res.render('signin', { title : 'LogIn/eBay', error : 'Invalid Email Id or Password.'});
					}
				} else {
					console.log("Invalid Email Id");
					res.render('signin', { title : 'LogIn/eBay', error : 'Invalid Email Id or Password.'});
				}
			}
		}, globals.queryString);
	} else {
		res.render('login',{ title : 'LogIn/eBay', error : 'You Need to Login First'});
	}
};



// All Code With Connection Pooling

exports.signIn = function (req,res) {
	console.log('SignIn');
	globals.queryString = "select * from product_view LIMIT 30";
	console.log("Query is : " + globals.queryString);
	
	// Connection Poling Call
	mysqlpool.execQuery(globals.queryString,'',function(err,results){
		if(err){
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			globals.resultSet = JSON.parse(JSON.stringify(results));
		}
	});
	res.render('signin', {title : 'LogIn/eBay', error : ''});
};

exports.userLogin = function (req,res){
	var user = req.param("inputEmail");
	var pwd = req.param("inputPwd");
	var cols = [];
	if(user !== null){
		globals.queryString = 'SELECT * FROM ?? WHERE ?? = ?';
		console.log("Query is : " + globals.queryString);
		
		// Connection Poling Call
		mysqlpool.execQuery(globals.queryString,['person','emailaddr',user],function(err,results){
			if(err){
				res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
			} else {
				if(results.length > 0){
					var resultStr = JSON.parse(JSON.stringify(results));
					if(resultStr[0].password === pwd){
						globals.Auth = true;
						globals.usrFName = resultStr[0].firstname;
						globals.usrLName = resultStr[0].lastname;
						globals.address =  resultStr[0].address;
						globals.city =  resultStr[0].city;
						globals.state =  resultStr[0].state;
						globals.country =  resultStr[0].country;
						globals.zipcode =  resultStr[0].zipcode;
						globals.email = resultStr[0].emailaddr;
						globals.lastLogin = resultStr[0].lastlogin;
						globals.user_Id = resultStr[0].memberid;
						var admin = resultStr[0].admin;
						if(admin == 'no')
							res.render('userHome', { title: 'DashBoard/eBay', userName : globals.usrFName, result : globals.resultSet, userId:globals.user_Id});
						else
							res.render('admin', { title: 'DashBoard/eBay', userName : globals.usrFName, result : globals.resultSet});
					} else {
						console.log("Invalid Login password");
						res.render('signin', { title : 'LogIn/eBay', error : 'Invalid Email Id or Password.'});
					}
				} else {
					console.log("Invalid Email Id");
					res.render('signin', { title : 'LogIn/eBay', error : 'Invalid Email Id or Password.'});
				}
			}
		});
	} else {
		res.render('login',{ title : 'LogIn/eBay', error : 'You Need to Login First'});
	}
};

exports.signUp = function (req, res){
	console.log('signup');
	globals.queryString = "select * from product_view LIMIT 30";
	console.log("Query is : " + globals.queryString);
	
	// Connection Poling Call
	mysqlpool.execQuery(globals.queryString,'',function(err,results){
		if(err){
			res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
		} else {
			globals.resultSet = JSON.parse(JSON.stringify(results));
		}
	});
	res.render('signup', {title : 'Register/eBay', error : ''});
};

exports.registerUser = function (req,res){
	globals.usrName = req.param("firstname");
	var lname = req.param("lastname");
	globals.email = req.param("email");
	var pwd = req.param("password");
	var addr = req.param("address");
	var city = req.param("city");
	var zip = req.param("zipcode");
	var state = req.param("state");
	var country = req.param("country_id");
	var acc_no = 12456789;
	
	globals.queryString = "select ?? from ?? where emailaddr = ?";
	mysqlpool.execQuery(globals.queryString,['emailaddr','person',globals.email],function(err,results){
		console.log("Result : " + results);
		if(results.length === 0){
			var posts = {firstName : globals.usrName, lastName : lname, emailaddr : globals.email, password : pwd, address : addr, city : city, zipcode : zip, state : state, country : country, payement_type : '', payment_accno : acc_no};
			globals.queryString = "insert into person SET ?";
			console.log("SignUp Query is:" + globals.queryString);
			mysqlpool.execQuery(globals.queryString, posts, function(err,results){
				if(err){
					//throw err;
					res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
				} else {
					var cols = ['memberid'];
					globals.queryString = "select ?? from ?? where emailaddr = ?";
					console.log("Inner Query :: " + globals.queryString);
					mysqlpool.execQuery(globals.queryString,[cols,'person',globals.email],function(err,results){
						if(err){
							res.render('error', {title: 'Error/eBay', Error : 'Something Went Wrong! Please try again'});
						} else {
							if(results.length > 0){
								var resultStr = JSON.parse(JSON.stringify(results));
								globals.usrFName = resultStr[0].firstname;
								globals.usrLName = resultStr[0].lastname;
								globals.address =  resultStr[0].address;
								globals.city =  resultStr[0].city;
								globals.state =  resultStr[0].state;
								globals.country =  resultStr[0].country;
								globals.zipcode =  resultStr[0].zipcode;
								globals.user_Id = resultStr[0].memberid;
								globals.lastLogin = resultStr[0].lastLogin;
								
								console.log('result : ' + globals.resultSet);
								res.render('userHome', { title: 'DashBoard/eBay',userName : globals.usrName, result: globals.resultSet, userId:globals.user_Id});
							} else {
								console.log('Cannot Create User');
								res.render('signup', { title : 'Register/eBay', error : 'Error Occured Cannot Create User.'});
							}
						}
					});
				}
			});
		} else {
			console.log("User Already Exist...");
			res.render('signup', { title : 'Register/eBay', error : 'User Already Exists'});
		}
	});
};

exports.logout = function(req , res){
	globals.usrName = '';
	globals.lastLogin = '';
	globals.user_Id = '';
	globals.queryString = '';
	globals.Auth = false;
	console.log("Logout Session From Site");
	res.render('signin', { title : 'LogIn/eBay', error : ''});
};