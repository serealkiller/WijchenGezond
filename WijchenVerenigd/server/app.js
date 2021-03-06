var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
mongoose.connect("localhost/WijchenGezond");

//var activiteitenRouter = require('./routes/activiteitenRouter.js')(express);
var categorieenRouter = require('./routes/categorieenRouter.js')(express);
var gebruikersRouter = require('./routes/gebruikersRouter.js')(express);
var activiteitenRouter = require('./routes/activiteitenRouter.js')(express);
var meterRouter = require('./routes/meterRouter.js')(express);
var fasRouter = require('./routes/feedsAndStatsRouter.js')(express);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(expressSession({secret: 'madMen', saveUninitialized: true, resave: true}));

app.use('/feeds', fasRouter);
app.use('/activiteiten', activiteitenRouter);
app.use('/categorieen', categorieenRouter);
app.use('/gebruikers', gebruikersRouter);
app.use('/meter', meterRouter);

app.use(express.static(path.join(__dirname, '../client')));
server.listen(port);
console.log("WijchenGezond-app is actief op port " + port);
