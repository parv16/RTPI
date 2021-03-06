var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var favicon = require('serve-favicon');
var path = require('path');
var dbConfig = require('./app/config/database');

// Connect to DB
mongoose.connect(dbConfig.url);

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// using public directory
app.use(express.static(path.join(__dirname, 'public')));


// Configuring Passport

var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./app/passport/init');
initPassport(passport);

var routes = require('./app/routes/')(app);


// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
module.exports = app;
