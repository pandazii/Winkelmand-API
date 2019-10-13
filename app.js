var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var customer = require('./routes/customer');
var product = require('./routes/product');
var cart = require('./routes/cart');
var reset = require('./routes/reset');
var app = express();


// uncomment after placing your favicon in /public
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Define the URL structure
let apiVersion = '/v1';
let urlRoot = '/shoppingcart/api' + apiVersion;
let urlCustomer = '/customer-management';
let urlProduct = '/product-management';
let urlCart = '/cart-management';
let urlReset = '/reset';

app.use(urlRoot + urlCustomer,customer);
app.use(urlRoot + urlProduct,product);
app.use(urlRoot + urlCart,cart);
app.use(urlRoot + urlReset, reset);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app; 