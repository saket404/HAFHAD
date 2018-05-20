var express = require('express');
var router = express.Router();
const moment      = require('moment');

var plugHelper = require('../function/plugHelper');
var newPlugHelper = require('../function/newPlugHelper');
var databaseHelper = require( '../function/databaseHelper' )
var eventHelper = require( '../function/eventHelper' );

router.get('/', function(req, res, next) {
  
});

/*********************************************************
* LOGIN
**********************************************************/
router.post('/login', async (req, res, next) => {

  // Get mac, ip, state true/false
  let post = req.body;
  let sql = 'SELECT userKey from `user_tb` WHERE email="'+post.email+'" AND password ="'+post.password+'"';
  
  let data = await databaseHelper.getData( sql )
  if(data.length > 0){
    req.session.userKey = data[0].userKey;
    res.send({redirect: '/devices'});
  }
  else{
    //res.send({redirect: '/login'});
  }
});

/*********************************************************
* Return device icons + labels
**********************************************************/
router.get('/getDeviceIcon', async (req, res, next) => {

  var sql = 'SELECT id, icon, label FROM `devicetype_tb`;';
  let data = await databaseHelper.getData( sql )
  res.send(data);

} );

/*********************************************************
* 
**********************************************************/
router.get('/getNotification', async (req, res, next) => {

  var userKey = req.session.userKey;
  var notiArray = [];

  var sql = 'SELECT * FROM notification_tb WHERE userKey="'+userKey+'" ORDER BY datetime DESC;';
  let data = await databaseHelper.getData( sql )
  var rowId = 0;

  if(data.length > 0){
    data.forEach( eachData =>{
      var dataArray = [];
      
      if( eachData.type == 'success' )
        iconType = 'check';
      else if( eachData.type == 'alarm' )
        iconType = 'alarm';
      else if( eachData.type == 'info' )
        iconType = 'info_outline';
      else if( eachData.type == 'danger')
        iconType = 'clear';
      else if( eachData.type == 'warning')
        iconType = 'new_releases';
      else
        iconType = '';
      
      let icon = '<div class="alert-icon"> <i class="material-icons"> ' + iconType + ' </i> </div>';
      // var isAck = eachData.isAck == false ? 'btn-primary' : 'disabled';
      // let ackButton = '<button class="btn '+ isAck +' btn-fab btn-fab-mini btn-round" onclick="changeAckState('+rowId+')" > <i class="material-icons"> visibility </i> </button>'
      
      let datetime = moment(eachData.datetime).format('hh:mm DD/MM/YY');

      dataArray.push( eachData.id );
      dataArray.push( icon );
      dataArray.push( datetime );
      dataArray.push( eachData.content );
      // dataArray.push( eachData.isAck );
      // dataArray.push( ackButton );
      
      notiArray.push( dataArray );
      rowId++;
    });
  }
      
  // Return data
  var returnData = { 'data' : notiArray };

  res.contentType( 'json' );
  res.send( returnData );
  res.end();

});

/*********************************************************
* Generate all plug data for table
**********************************************************/
router.get('/getDeviceTableData', async (req, res, next) => {
  var userId = 1
  var deviceData = []
  // var isAll =  req.param('all');

  // get all plug data
  try {
    let devices = await databaseHelper.getPlugFromUserKey(req.session.userKey);
    let iconMap = await databaseHelper.getIconDeviceMapping();
    if(devices.length){

      var rowId = 0
      // Process icon
      devices.forEach(device => {
        var dataArray = [];

        // Set image
        var iconButton = '<button class="btn btn-primary btn-fab btn-lg"> <i class="material-icons" style="font-size:1.25em">' + iconMap[device.type] + '</i> </button>'
        
        // If not valid plug -> not set button
        if( !device.isValid ){
          var stateButton = '';
        }
        // Set button On/Off
        else{
          if( device.state )
            var stateButton = '<button id="button'+rowId+'" class="btn btn-primary btn-round btn-block" onclick="changeState_cb('+rowId+')">ON</button>';
          else
            var stateButton = '<button id="button'+rowId+'" class="btn btn-basic btn-round btn-block" onclick="changeState_cb('+rowId+')">OFF</button>';
        }
        
        dataArray.push( iconButton )
        dataArray.push( device.alias )
        dataArray.push( stateButton )
        dataArray.push( device.mac )
        dataArray.push( device.ip )
        dataArray.push( device.state )

        deviceData.push( dataArray );
        rowId++
      });

      // Return data
      var returnData = { 'data':deviceData };
    }

  } catch(error) {
    console.error(error.message)
  } finally {
    res.contentType('json');
    res.send(returnData);
    res.end();
  }

});

router.get('/getDeviceOptionData', async (req, res, next) => {

  var deviceData = []

  // get all plug data
  try {
    let devices = await databaseHelper.getPlugFromUserKey(req.session.userKey);
    let iconMap = await databaseHelper.getIconDeviceMapping();
    if(devices.length){

      devices.forEach(device => {
        delete device["plugId"];
        delete device["userKey"];
      });

      // Return data
      var returnData = { 'data':devices, 'icon':iconMap };
    }

  } catch(error) {
    console.error(error.message)
  } finally {
    res.contentType('json');
    res.send(returnData);
    res.end();
  }

});


router.get('/getChartData', async (req, res, next) => {
  var conArray = false;
  try {
    let devices = await databaseHelper.getPlugFromUserKey(req.session.userKey);
    conArray = [];
    for (let device of devices) {

      if(device.isValid == 1){
        console.log(device.ip);

        let conData = await plugHelper.getConsumptionData(device.ip, req.body.startDate, req.body.endDate);
        let con = conData[0].day_list;
        conArray.push({alias:device.alias, con:con});
        
      }else{
        console.log('Plug '+device.alias+' is not valid');
      }
    }
  }
  catch(e){
  }
  res.send(conArray);
  res.end();

});

router.post('/getDeviceDataOnChange', async (req, res, next) => {
  var userKey = req.session.userKey;
  var alias = req.body.alias;

  var sql = 'SELECT alias, mac, ip, type, info FROM `plug_tb` WHERE userKey="'+userKey+'" AND alias="'+alias+'";';
  let data = await databaseHelper.getData( sql )
  res.send(data);
});

/*********************************************************
* 
**********************************************************/
router.get('/setNewPlug', async (req, res, next)=>{
  var alias = req.body.alias;
  var type = req.body.type;

  netData = await eventHelper.getSSIDAndPass();
  if(!netData.length)
    return false;

  newPlugHelper.connectPlugToWifi( netData[0], netData[1], alias, type, (e)=>{
    return e;
  });
});

/*********************************************************
* Set state of plug true->false or false->true
**********************************************************/
router.post('/changeDeviceState', async (req, res, next) => {

  var userId = 1;

  // Get mac, ip, state true/false
  var mac = req.body.mac;
  var ip = req.body.ip;
  var state = req.body.state;
  console.log(state);
  var boolState = (state == 1) ? true : false;

  // Set plug state
  plugHelper.setPlugState(ip, boolState, async (e)=>{
    if(e)
      await databaseHelper.setPlugState( req.session.userKey, mac, state)
    res.send( e );
  })
});

/*********************************************************
* Update button in device page
**********************************************************/

router.post('/updatePlugData', async ( req, res, next ) => {

  var userKey = req.session.userKey;
  var alias = req.body.alias;
  var mac = req.body.mac;
  var ip = req.body.ip;
  var info = req.body.info;
 
  //  Create query
  var sql = 'UPDATE `plug_tb` SET alias="'+alias+'", ip="'+ip+'", info="'+info+'" WHERE userKey="'+userKey+'" AND mac="'+mac+'";';
  console.log(sql);
  //  Call update
  await databaseHelper.updateData( sql );
});



/*********************************************************
* Update button in account page
**********************************************************/

router.post('/updateInfoData', async ( req, res, next ) => {

  var userKey = req.session.userKey;
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var address = req.body.address;

  //  Create query
  var sql = 'UPDATE `user_tb` SET name="'+name+'", email="'+email+'", password="'+password+'", address="'+address+'" WHERE userKey="'+userKey+'";';

  //  Call update
  await databaseHelper.updateData( sql );
});

router.post('/updateNotiData', async ( req, res, next ) => {

  var userKey = req.session.userKey;
  var email = req.body.email;
  var password = req.body.password;

  //  Create query
  var sql = 'UPDATE `user_tb` SET email_id="'+email+'", email_password="'+password+'" WHERE userKey="'+userKey+'";';

  //  Call update
  await databaseHelper.updateData( sql );
});

router.post('/updateApiData', async ( req, res, next ) => {

  var userKey = req.session.userKey;
  var clientId = req.body.clientId;
  var clientSecret = req.body.clientSecret;

  //  Create query
  var sql = 'UPDATE `user_tb` SET apiKey="'+clientId+'", apiSecret="'+clientSecret+'" WHERE userKey="'+userKey+'";';

  //  Call update
  await databaseHelper.updateData( sql );
});

router.post('/updateRatioData', async ( req, res, next ) => {

  var userKey = req.session.userKey;
  var ratio = req.body.ratio;

  //  Create query
  var sql = 'UPDATE `user_tb` SET ratio="'+ratio+'" WHERE userKey="'+userKey+'";';

  //  Call update
  await databaseHelper.updateData( sql );
});

/*********************************************************
* Get data for account page
**********************************************************/
router.post('/getAccountData', async ( req, res, next ) => {

  var userKey = req.session.userKey;
  var sql = 'SELECT name, email, password, address, apiKey, apiSecret, email_id, email_password, ratio FROM `user_tb` WHERE userKey="'+userKey+'";';
  let data = await databaseHelper.getData( sql )
  res.send(data);
});


module.exports = router;
