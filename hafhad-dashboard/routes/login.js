var express = require('express');
var router = express.Router();

var databaseHelper = require( '../function/databaseHelper' )

router.get('/', async function(req, res, next) {

  // Return render
  res.render('login', { 
    title: 'Login',

  });

});

module.exports = router;
