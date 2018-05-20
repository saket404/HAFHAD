// ################################################################# //
// ######	           USER VARIABLE CHANGE HERE!!!		            #### //
// ################################################################# //

var selfIP = '192.168.0.1';
//var roomSSID = 'SeniorRoom_2G';
//var roomPass = 'testuser';

var plugAlias = 'ห้องนอน';
var userKey = 'QWERTY1234';

// ################################################################# //
// ######	                 REQUIRE MODULE   				            #### //
// ################################################################# //
const { Client } 	= require('tplink-smarthome-api');
const { spawn } 	= require('child_process');
const { exec } 		= require('child_process');
const wifi = require('node-wifi');

var databaseHelper = require("./databaseHelper.js");

const client 			= new Client();     // for plug

wifi.init({
  iface : null // network interface, choose a random wifi interface if set to null
});

// ################################################################# //
// ######	                     FUNCTION                         #### //
// ################################################################# //

function findIPfromMAC ( plugMAC, callback )
{

  plugMAClo = plugMAC.toLowerCase();

  const { exec } = require('child_process');
  var plugIP;

  console.log('Find Plug IP...');
  setTimeout(function () {
    exec("nmap -sP 192.168.1.0/24 >/dev/null && arp -an | grep "+plugMAClo+" | awk '{print $2}' | sed 's/[()]//g'", (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.log('IP NOT FOUND!');
        callback(false);
      }
      else{
        plugIP = stdout;
        callback(plugIP);
      }
    });
  }, 3000);
}

function getPlugSsid( callback ){

  var ssid = false;

  // Scan wifi ssid
  wifi.scan(function(err, networks) {

    if (!err) {
    // Return ssid if not error
      networks.forEach(network => {
        if(network.ssid.includes('TP-LINK') ){
          ssid = network.ssid;
        }
      });
    }
    callback(ssid);
  });
}

function connectToWifi(ssid, password, callback){

  // Connect to room wifi
  wifi.connect({ ssid : ssid, password : password}, function(err) {
    
    if (err) {
      callback(false);
    }

    var temp = '';
    do{
      setTimeout(() => {
        wifi.getCurrentConnections(function(err, currentConnections) {
          temp = currentConnections.ssid;
        });
      }, 3000);
    }while(temp == ssid);

    callback(true);
  });
}

function connectPlugToWifi( roomSSID, roomPass, plugAlias, plugType, callback ){

  //  Get plug ssid
  getPlugSsid( (plugSsid)=>{
    if(plugSsid){

      // Connect rasp to plug ssid
      connectToWifi(plugSsid, '', (res)=>{
        if(res){
          var mac;

          // Set plug to room wifi
          client.getDevice( { host: selfIP } ).then( ( selfDevice ) => {		
            mac = selfDevice.mac;
            selfDevice.setPowerState(true);

            //SET PLUG TO CONNECT WIFI
            selfDevice.send( { "netif": { "set_stainfo": { "ssid":roomSSID, "password":roomPass, "key_type":3 } } } );	
          });

          setTimeout(() => {

            // Connect back to room wifi
            connectToWifi(roomSSID, roomPass, (res)=>{
              if(res){
                findIPfromMAC(mac, (ip)=>{
                  console.log(ip);
                  if(ip != ''){
                    const plug = client.getDevice( { host: ip } ).then( ( device )=>{
                      device.setPowerState( false );
                      device.setAlias( plugAlias ).then( function() {
                        console.log( 'Current Plug name: ' + device.alias );
                        databaseHelper.writeDeviceData(userKey, device.alias, mac, ip, device.relayState, plugType);  
                        callback(true);
                      });
                      
                    });
                  }
                  else{
                    // Can't find ip
                    callback(false);
                  }
                });
              }
              else{
                // Can't connect back to wifi
                callback(false);
              }
            });
          }, 7000);


        }
        else{
          // Can't connect plug
          console.log('Cannot connect to plug');
          callback(false);
        }
      });
    }
    else{
      console.log('Cannot find plug');
      callback(false);
    }
  });
}

// ################################################################# //
// ######	                     MODULES                          #### //
// ################################################################# //
exports.getPlugSsid = getPlugSsid;
exports.connectToWifi = connectToWifi;
exports.connectPlugToWifi = connectPlugToWifi;