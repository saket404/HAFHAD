var express = require('express');
var router = express.Router();

var plugHelper = require('../function/plugHelper');
var newPlugHelper = require('../function/newPlugHelper');
var databaseHelper = require( '../function/databaseHelper' )
var firebaseHelper = require( '../function/firebaseHelper' );
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
/// WARNING :: THIS FUNCTION STILL USE FIREBASE HELPER
router.get('/getDeviceIcon', (req, res, next) => {

  firebaseHelper.getDeviceIcon( ( status, data ) => {

    res.contentType( 'json' );
    res.send( data );
    res.end();

  } );

} );

/*********************************************************
* 
**********************************************************/
/// WARNING :: THIS FUNCTION STILL USE FIREBASE HELPER
router.get('/getNotification', (req, res, next) => {

  var userId = 1
  var notiArray = [];

  firebaseHelper.getNotificationData( userId, ( status, data ) => {
    if( status == true ){

      var rowId = 0

      data.forEach( eachData =>{
        var dataArray = [];
        
        if( eachData.type == 'success' )
          iconType = 'check'
        else if( eachData.type == 'alarm' )
          iconType = 'alarm'
        else if( eachData.type == 'info' )
          iconType = 'info_outline'
        else if( eachData.type == 'danger')
          iconType = 'clear'
        else
          iconType = ''

        var icon = '<div class="alert-icon"> <i class="material-icons"> ' + iconType + ' </i> </div>';
        var isAck = eachData.isAck == false ? 'btn-primary' : 'disabled';
        var ackButton = '<button class="btn '+ isAck +' btn-fab btn-fab-mini btn-round" onclick="changeAckState('+rowId+')" > <i class="material-icons"> visibility </i> </button>'

        dataArray.push( eachData.id )
        dataArray.push( icon )
        dataArray.push( eachData.datetime )
        dataArray.push( eachData.content )
        dataArray.push( eachData.isAck )
        dataArray.push( ackButton )

        notiArray.push( dataArray )
        rowId++

      } );
    }

    // Return data
    var returnData = { 'data' : notiArray };

    res.contentType( 'json' );
    res.send( returnData );
    res.end();

  } );

} );

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

})

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

/// WARNING :: THIS FUNCTION STILL USE FIREBASE HELPER
router.post( '/changeAckState', ( req, res, next ) => {

  var userId = 1;

  var id = req.body.id;
  var isAck = req.body.isAck == 'true' ? true : false;

  firebaseHelper.setAckState( userId, id, isAck, ( status ) => {
    res.send( status );
  });
});

module.exports = router;
