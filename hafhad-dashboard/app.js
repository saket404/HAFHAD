/**************************************
 *  REQUIRE MODULES
 **************************************/

const createError = require( 'http-errors' );
const express = require( 'express' );
const session = require('express-session')
const path = require( 'path' );
const cookieParser = require( 'cookie-parser' );
const logger = require( 'morgan' );

// var databaseHelper = require( './function/databaseHelper' )
// var firebaseHelper = require( './function/firebaseHelper' )
// var eventHelper = require( './function/eventHelper' )

/**************************************
 *  DEFINE VARIABLE
 **************************************/
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

/**************************************
 *  ROUTE
 **************************************/

const indexRouter = require( './routes/index' );
const devicesRouter = require( './routes/devices' );
const consumptionRouter = require( './routes/consumption' );
const notificationRouter = require( './routes/notification' );
const accountRouter = require( './routes/account' );
const loginRouter = require( './routes/login' );
const ajaxRouter = require( './routes/ajax' );

/**************************************
 *  EXPRESS
 **************************************/
var app = express();

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );

///// PATH & MIDDLEWARE
app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false }) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( session( {
  secret: 'hafhad_c3pe',
  resave: false,
  saveUninitialized: true
}));

app.use( '/data', express.static( __dirname + '/public/data' ) );
app.use( '/function', express.static( __dirname + '/function' ) );

app.use( '/js', express.static( __dirname + '/public/js' ) );
app.use( '/css', express.static( __dirname + '/public/css' ) );
app.use( '/img', express.static( __dirname + '/public/img' ) );
app.use( '/fonts', express.static( __dirname + '/public/fonts' ) );

///// ROUTER
app.use( '/', indexRouter );
app.use( '/devices', devicesRouter );
app.use( '/consumption', consumptionRouter );
app.use( '/notification', notificationRouter );
app.use( '/account', accountRouter );
app.use( '/login', loginRouter );
app.use( '/ajax', ajaxRouter );

///// ERROR HANDLER

app.use( function( req, res, next ) {
  next( createError( 404 ) );
});

app.use( function( err, req, res, next ) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

  res.status( err.status || 500 );
  res.render( 'error' );
});

module.exports = app;
