
var firebase = require( 'firebase' );

var config = {
  apiKey: "AIzaSyBIzv-xxZNIlPv73EK8vy5PnyeTWXlSa70",
  authDomain: "plugdatabase.firebaseapp.com",
  databaseURL: "https://plugdatabase.firebaseio.com",
  projectId: "plugdatabase",
  storageBucket: "plugdatabase.appspot.com",
  messagingSenderId: "140596753000"
};

firebase.initializeApp( config );

var database = firebase.database();

/**************************************
*  Get all device type icon + label
**************************************/
function getDeviceIcon( callback ){

  var data = [];
  var status = true;

  ref = database.ref('/device-type');
  ref.once('value', function (snap) {
    snap.forEach(function (childSnap) {
      data.push({
        'icon': childSnap.val().icon,
        'label': childSnap.val().label,
        'id': childSnap.val().id, 
      })
    });
    if( data == '' ) {
        // if not found
      status = false;
    }
    callback( status, data );
  });
}

/**************************************
*  Get all notification of user X
**************************************/
function getNotificationData( userId, callback ){
  var data = [];
  var status = true;

  // Ref database, get data
  notiRef = database.ref('/notification/' + userId);
  notiRef.once('value', function (snap) {
    snap.forEach(function (childSnap) {
      data.push({
        'datetime': childSnap.val().dateTime,
        'content': childSnap.val().content,
        'type': childSnap.val().type,
        'id': childSnap.val().id,
        'isAck': childSnap.val().isAck,
      })
    });
    if( data == '' ) {
        // if noti not found
      status = false;
    }
    callback( status, data );
  });
}

function setAckState( userId, id, isAck, callback ){

  notiRef = database.ref('/notification/' + userId + '/' + id);
  notiRef.once('value', function (snap) {

  });
  // notiRef.update( {
  //   isAck : isAck,
  // });

  callback( true )

}

/**************************************
*  Get all plug data of user X
**************************************/
function getPlugData( userId, callback ) {

  var data = [];
  var status = true;

  // Ref database, get data
  plugRef = database.ref('/user-plugs/' + userId);
  plugRef.once('value', function (snap) {
    snap.forEach(function (childSnap) {
      data.push({
        'alias': childSnap.val().alias,
        'id': childSnap.val().id,
        'ip': childSnap.val().ip,
        'mac': childSnap.val().mac,
        'state': childSnap.val().state,
        'isValid': childSnap.val().isValid,
        'type': childSnap.val().type,
      })
    });
    if( data == '' ) {
        // if plug not found
      status = false;
    }
    callback( status, data );
  });
}

function getAllConsumption( userId, callback ) {
  plugRef = database.ref('/user-plugs/' + userId);
  plugRef.once('value', function (snap) {
    snap.forEach(function (childSnap) {
      data.push({
        'alias': childSnap.val().alias,
        'consumption': childSnap.val().consumption,
      })
    });
    if( data == '' ) {
        // if plug not found
      status = false;
    }
    callback( status, data );
  });
}

/*********************************************************
*  Test plug, set state of plug both physical and online
**********************************************************/
function setPlugState( userId, mac, ip, state, callback ){

  // call plug with ip
  // IMPLEMENT ME

    // Set state of plug physically
    // IMPLEMENT ME

      // Update firebase
      // console.log( mac + ip + state );
      plugRef = database.ref( '/user-plugs/' + userId + '/' + mac );
      plugRef.update( {
        state : state,
      });

      callback( true )

}

/*********************************************************
* 
**********************************************************/
function plugSetting( plugName ) {
  console.log( 'call plug setting with plug name ' + plugName );
}

/*********************************************************
*  Update isValid and state of plug
**********************************************************/
function updatePlug(){

  // Loop all plug ip
  // Test ip
    // Valid -> update state
    // Not valid -> update isValid
}

/*********************************************************
* Update consumption to firebase
**********************************************************/
function pushConsumtion() {
  console.log( new Date() );
}

/*********************************************************
* Write New device data to firebase
**********************************************************/
function writeDeviceData( userId, alias, mac, ip, state, info ) {
  
  mac = mac.toLowerCase();
  
  plugRef = database.ref( '/user-plugs/' + userId + '/' + mac );
  plugRef.set( {
    alias: alias, mac: mac, ip : ip, isValid:true, state : state, info: info,
  });

}

/*********************************************************
* Get data from input alias
**********************************************************/
function readDeviceDataFromAlias( userId, plugname, callback ) {
  var result = '';
  plugRef = database.ref('/user-plugs/' + userId);
  plugRef.once('value', function (snap) {
    snap.forEach(function (childSnap) {
      if(childSnap.val().alias == plugname) {
          deviceIP = childSnap.val().ip;
          result = {
            'status': true,
            'alias': plugname,
            'ip': deviceIP
          }
          callback( result );
      }
    });
    if( result == '' ) {
        // if plug not found
      result = {
        'status': false,
        'alias': plugname,
        'ip': ''
      }
      callback( result );
    }
  });
}

exports.getNotificationData = getNotificationData;
exports.getDeviceIcon = getDeviceIcon;

exports.getPlugData = getPlugData;
exports.getAllConsumption = getAllConsumption;

exports.plugSetting = plugSetting;
exports.pushConsumtion = pushConsumtion;
exports.setPlugState = setPlugState;

exports.writeDeviceData = writeDeviceData;
exports.readDeviceDataFromAlias = readDeviceDataFromAlias