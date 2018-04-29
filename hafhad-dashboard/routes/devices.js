var express = require('express');
var router = express.Router();

var eventHelper = require( '../function/eventHelper' )

router.get('/', eventHelper.checkAuth, function(req, res, next) {
  if (req.session.userKey)
    isLogin = true;
    
    res.render('devices', { 
      title: 'Devices',
      isLogin: isLogin
  });
  
});

module.exports = router;
