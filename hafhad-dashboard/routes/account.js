var express = require('express');
var router = express.Router();

var eventHelper = require( '../function/eventHelper' )

var isLogin = false;

router.get('/', eventHelper.checkAuth, function(req, res, next) {

  if (req.session.userKey)
    isLogin = true;

  res.render('account', { 
    title: 'Account',
    isLogin: isLogin,

  });
});

module.exports = router;
