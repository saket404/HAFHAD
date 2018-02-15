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

var firebaseController = require("./firebaseController.js");

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
          console.log(plugSSID);
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

module.exports = {

  settingDevice: function( roomSSID, roomPass, myALIAS, callback) {

    getSSID( function( ssid ) {

      if(ssid == ''){
        console.log('Plug not found');
        callback(false);
        process.exit();
      }
      else{
        plugSSID = ssid;

        connectToPlugSSID( plugSSID,  function( status1 ) {

          if( status1 ) {
            // CONNECT PLUG
            client.getDevice( { host: selfIP } ).then( ( selfDevice ) => {		
              plugINFO = selfDevice.sysInfo;
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
                        device.setAlias( myALIAS ).then( function() {
                          console.log( 'Current Plug name: ' + device.alias );
                          //device.getSysInfo().then( console.log );
                          firebaseController.writeDeviceData( 1, device.alias, plugMAC, plugIP, device.relayState, plugINFO );  
                          callback(true);
                        });
                        
                      });
                    }
                  });
                }
                else {
                  console.log( 'can\'t connect to room wifi ' );
                  callback(false);
                  process.exit();
                }
              });

            });
          }
          else {
            console.log( 'can\'t connect to plug ' );
            callback(false);
            process.exit();
          }
        });
      }
    });
  }
}