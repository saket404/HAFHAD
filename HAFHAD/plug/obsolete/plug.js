// ################################################################# //
// ######	           USER VARIABLE CHANGE HERE!!!		        #### //
// ################################################################# //
var debugPlugIP = '192.168.1.84';
var userID = 1;

// ################################################################# //
// ######	                 REQUIRE MODULE   				    #### //
// ################################################################# //
const { Client } = require('tplink-smarthome-api');
const client = new Client();
var firebase = require("firebase");
var firebaseController  = require("./firebaseController.js");

var command;
var device1 = '';
var device2 = '';



// ################################################################# //
// ######	                     FUNCTION                       #### //
// ################################################################# //


///
///		FUNCTION set device open/close with input <IP>
///		return N/A
function setStatePlug ( state, deviceIP, database, callback ) {

	setTimeout(function(){ 
		const plug = client.getDevice( { host: deviceIP } ).then( ( device ) => {
			device.setPowerState( state, function(){
				callback(true);
			} );
			firebaseController.updateDeviceStateFromMac( userID, device.mac, state, function(){

			} );
			
		}, (err) => {
			callback(false);
			database.goOffline();
		});

	 }, 2000);
	

}


// ################################################################# //
// ######	                 START HERE						    #### //
// ################################################################# //

process.argv.forEach(function(index) {
	index = 'open,ห้องนอน,ห้องครัว';
	var words = index.split(',');

	if ( words.length > 1 ){

		/*  check command open/close */
		if( words[0] == 'open' )
			command = true;
		else if( words[0] == 'close' )
			command = false;
		else
			return 0;

		/*  let device1 = name1 */
 		device1 = words[1];

		/* let device2 = name2 if exist */
		if ( words.length == 3 ){
			device2 = words[2];
		}
	}
	else {
		return 0;
	}
	

});

var returnToPython = '';
var temp1 = false;
var temp2 = false;

if( device1 != '' ) {

	firebaseController.readDeviceDataFromAlias( userID, device1, function( deviceJson, database ) {

		if( deviceJson.status ) {
			setStatePlug ( command, deviceJson.ip, database , function( status ) {
				if( status ){
					returnToPython += device1 + 'สำเร็จ, ';
					temp1 = true;
				}
				else{
					returnToPython += 'ไอพีของdevice'+device1+'ผิดพลาด, ';
					temp1 = true;
				}
			});
		}
		else {
			returnToPython += 'ไม่มีdeviceชื่อ'+ device1 + ', ';
			temp1 = true;
		}
	} )
}

if( device2 != '' ) {

	firebaseController.readDeviceDataFromAlias( userID, device2, function( deviceJson, database ) {

		if( deviceJson.status )
			setStatePlug ( command, deviceJson.ip, database, function( status ) {
				if(status){
					returnToPython += device2 + 'สำเร็จ, ';
					temp1 = true;
				}
				else{
					returnToPython += 'ไอพีของdevice'+device2+'ผิดพลาด, ';
					temp1 = true;
				}
			} );
		else {
			returnToPython += 'ไม่มีdeviceชื่อ'+ device2;
			temp1 = true;
		}
			
	});
}

// while( temp1!=true && temp2!=true ){

// }
// console.log(returnToPython);