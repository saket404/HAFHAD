
function repeatEvery(func, interval) {

  var now = new Date()
  var delay = interval - now % interval;

  function start() {
    func();
    setInterval(func, interval);
  }

  setTimeout(start, delay);
}

function checkAuth(req, res, next) {
  if (!req.session.userKey) {
    res.redirect('/login');
    
  } else {
    //res.redirect('/index');
    next();

  }
}

function getSSIDAndPass(){
  
  let ssid = 'SeniorRoom_2G';
  let pass = 'testuser';
  
  return [ssid, pass];
}

exports.repeatEvery = repeatEvery;
exports.checkAuth = checkAuth;
exports.getSSIDAndPass = getSSIDAndPass;