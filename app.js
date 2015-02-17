var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , login = require('./routes/authentication')
  , index = require('./routes/index')
  , Bid = require('./routes/Bid')
  , Buy = require('./routes/Buy')
  , Sell = require('./routes/Sell')
  , Auction = require('./routes/Auction')
  , Categories = require('./routes/Categories')
  , Person = require('./routes/Person')
  , Product = require('./routes/Product')
  , Payment = require('./routes/Payment')
  , admin = require('./routes/admin');
  
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// LogIn & SignUp
app.get('/', index.index);
app.get('/login', login.signIn);
//app.post('/login', login.afterSignIn);
app.post('/login', login.userLogin);
app.get('/logout', login.logout);
app.get('/signup', login.signUp);
app.post('/signup', login.registerUser);

app.get('/home', index.home);
app.get('/adminHome', index.adminHome);

// Post Login Methods
app.post('/buy', Buy.buyProduct);
app.get('/sell', Sell.index);
app.post('/sell', Sell.sellProduct);
app.get('/bid', Bid.bidProduct);
app.get('/categories', Categories.fetchCategories);
app.get('/subcategories', Categories.fetchSubcategories);

app.get('/searchProduct', Product.searchProduct);
app.get('/fetchProductDetail',Product.fetchProductDetail);

//Admin functionalities
app.get('/adminProducts', admin.listallProduct);
app.get('/adminPersons', admin.listallPerson);
app.get('/adminBuyers', admin.listallbuyers);
app.get('/adminSellers', admin.listallsellers);
app.get('/adminAuctions', admin.listallauctions);
app.get('/delete', admin.deletefromtable);
app.get('/adminBuyersOfProduct', admin.listbuyersofProduct);
app.get('/adminSellersOfProduct', admin.listsellersofProduct);
app.post('/updateProduct', admin.updateProduct);
app.get('/searchPerson', admin.searchPerson);
app.get('/adminSearchPerson', admin.adminSearchPerson)

//User account details
app.post('/updatePerson', Person.updatePerson);
app.get('/sellingHistory',Person.sellingHistory);
app.get('/buyingHistory',Person.buyingHistory);
app.get('/biddingHistory',Person.biddingHistory);
app.get('/fetchPersonDetails',Person.fetchPersonDetails);

//Shopping Cart
app.get('/fetchfromcart', Product.fetchfromCart);
app.get('/addtocart',Product.addtoCart);
app.get('/buynow',Product.buynow);
app.get('/deletefromCart',Product.deletefromCart);

// payment detail mapping
app.get('/displayPayment', Payment.displayPayment);
app.post('/paymentDetails', Payment.paymentDetails);

//Auction.checkAuction();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});