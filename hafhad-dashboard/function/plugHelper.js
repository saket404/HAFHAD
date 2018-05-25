// ################################################################# //
// ######	           USER VARIABLE CHANGE HERE!!!		            #### //
// ################################################################# //

var selfIP = '192.168.0.1';

// ################################################################# //
// ######	                 REQUIRE MODULE   				            #### //
// ################################################################# //
const { Client } 	= require('tplink-smarthome-api');
const { spawn } 	= require('child_process');
const { exec } 		= require('child_process');
const piWifi 			= require('pi-wifi');
const moment      = require('moment');

var databaseHelper = require("./databaseHelper.js");

const client 			= new Client();     // for plug

// ################################################################# //
// ######	                     FUNCTION                         #### //
// ################################################################# //

//
//    get Plug ssid that name <TP-LINK>
//    return <ssid>
function getSSID( callback )
{
  const iwlist = spawn('iwlist', ['wlan0','scan']);
  iwlist.stdout.on('data', (chunk) => {
    var temp;
    var data = `${chunk}`;
    var lines = data.split(/\r?\n/);
    var plugSSID = ''

    lines.forEach(function(line)
    {
      if(line.includes('ESSID:')) {
        temp = line.replace('ESSID:"','');
        temp = temp.replace('"','');
        temp = temp.trim();
        if(temp.includes('TP-LINK')) {
          plugSSID = temp;
          //console.log(plugSSID);
        }
      }
    });
    callback( plugSSID );
  });
}

//
//    connect to plug wifi with <plugSSID>
//    return <status>
function connectToPlugSSID( plugSSID, callback ) 
{
  var status = false

  piWifi.connectOpen(plugSSID,  function(err) {
    console.log(err);
    if (!err) {
      console.log('Connect to PLUG...');
      setTimeout(function () {
        piWifi.check(plugSSID, function (err, status) {
          if (!err && status.connected) {
            console.log('SUCCESS');
            status = true;
            callback( status );
          }
          else {
            callback( status );
          }
        });
      }, 15000);
    }
    else {
      callback ( status )
    }
  });
}


//
//	    Connect to wifi with <ssid> and <password>
//
function connectToWiFi( roomSSID, roomPass, callback )
{
  var status = false
  piWifi.connect( roomSSID, roomPass, function( err ) 
  {
    if ( !err ) { //Network created correctly
      console.log('Connect to WIFI...');
      setTimeout(function () {
        piWifi.check( roomSSID, function ( err, status ) {
          if ( !err && status.connected ) {
            status = true;
            callback ( status )
          }
          else {
            callback ( status )
          }
        });
      }, 15000);
    } 
    else {
      callback ( status )
    }
  });
}

//
//	  Find <plug ip> from plug <MAC address>
//    return <ip>
function findIPfromMAC ( plugMAC, callback )
{

  plugMAClo = plugMAC.toLowerCase();

  const { exec } = require('child_process');
  var plugIP;

  console.log('Find Plug IP...');
  setTimeout(function () {
    exec("nmap -sP 192.168.1.0/24 >/dev/null && arp -an | grep "+plugMAClo+" | awk '{print $2}' | sed 's/[()]//g'", (err, stdout, stderr) => {
      if (err) {
        console.log('IP NOT FOUND!');
      }
      else{
        plugIP = stdout;
        callback(plugIP);
      }
    });
  }, 3000);
}


// ################################################################# //
// ######	                 MODULE    						                #### //
// ################################################################# //

var plugINFO;
var plugMAC;
var plugSSID;

function setPlugState (ip, state, callback){
  client.getDevice( { host: ip } ).then((device)=>{
    device.setPowerState(state);
    callback(true);
  }).catch((e)=>{
    callback(false);
  });
}

async function getConsumptionData(ip, startDate, endDate){
  startDate = moment(startDate);
  endDate = moment(endDate);
  var timeValues = [];
  var conDatas = [];

  while (endDate > startDate || startDate.format('M') === endDate.format('M')) {
    timeValues.push({year:startDate.format('YYYY'), month:startDate.format('MM')});
    startDate.add(1,'month');
  }
  console.log(ip);
  try{
    return new Promise((resolve, reject) => {
      client.getDevice( { host: ip } ).then( async(device)=>{
        for (let time of timeValues){
          let year = parseInt(time.year);
          let month = parseInt(time.month);
    
          let conData = await device.emeter.getDayStats(year, month).catch();
          // let realTime = await device.emeter.getRealtime().catch();
          
          conDatas.push(conData);
          // console.log(realTime);
        }
        resolve(conDatas);
      }).catch((e)=>{ reject(false) });
    });
  }
  catch(e){ }
}

async function getRealtimeData(ip){
  
  try{
    return new Promise((resolve, reject) => {
      client.getDevice( { host: ip } ).then( async(device)=>{
        let realTime = await device.emeter.getRealtime().catch();
        resolve(realTime);
      }).catch((e)=>{ reject(false) });
    });
  }
  catch(e){ }
}

function settingDevice( roomSSID, roomPass, plugAlias, plugType, callback) {

  getSSID( function( ssid ) {
    console.log(ssid);
    if(ssid == ''){
      console.log('Plug not found');
      callback(false);
      // process.exit();
    }
    else{
      plugSSID = ssid;
      connectToPlugSSID( plugSSID,  function( status1 ) {

        if( status1 ) {
          // CONNECT PLUG
          client.getDevice( { host: selfIP } ).then( ( selfDevice ) => {		
            plugMAC = selfDevice.mac;
            selfDevice.setPowerState(true);

            //SET PLUG TO CONNECT WIFI
            selfDevice.send( { "netif": { "set_stainfo": { "ssid":roomSSID, "password":roomPass, "key_type":3 } } } );	

            connectToWiFi( roomSSID, roomPass, function( status2 ){
              if( status2 ) {

                findIPfromMAC( plugMAC, function( plugIP ) {
                  if( plugIP != '' ) {
                    // GET PLUG IP FROM MAC.
                    console.log( 'FOUND IP ' + plugIP );
                    console.log( 'Connect to Plug...' );
                    const plug = client.getDevice( { host: plugIP } ).then( ( device )=>{
                      device.setPowerState( false );
                      device.setAlias( plugAlias ).then( function() {
                        console.log( 'Current Plug name: ' + device.alias );
                        databaseHelper.writeDeviceData(userKey, device.alias, plugMAC, plugIP, device.relayState, plugType)  
                        callback(true);
                      });
                      
                    });
                  }
                });
              }
              else {
                console.log( 'can\'t connect to room wifi ' );
                callback(false);
                // process.exit();
              }
            });

          });
        }
        else {
          console.log( 'can\'t connect to plug ' );
          callback(false);
          // process.exit();
        }
      });
    }
  });
}

exports.setPlugState = setPlugState;
exports.getConsumptionData = getConsumptionData;
exports.getRealtimeData = getRealtimeData

// NOT USE
exports.settingDevice = settingDevice;
exports.getSSID = getSSID;
exports.connectToPlugSSID = connectToPlugSSID;