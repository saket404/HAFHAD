var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {

  // Return render
  // res.render('index', { 
  //   title: 'Dashboard',

  // });
  if (!req.session.userKey)
    res.redirect('/login');
  else
    res.redirect('/devices');

});

module.exports = router;
