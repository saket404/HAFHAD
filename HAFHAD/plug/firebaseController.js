// ################################################################# //
// ######	                 REQUIRE MODULE   				    #### //
// ################################################################# //

var firebase = require("firebase");

//
//		INITIALIZE FIREBASE
//

var config = {
    apiKey: "AIzaSyBIzv-xxZNIlPv73EK8vy5PnyeTWXlSa70",
    authDomain: "plugdatabase.firebaseapp.com",
    databaseURL: "https://plugdatabase.firebaseio.com",
    projectId: "plugdatabase",
    storageBucket: "plugdatabase.appspot.com",
  };
firebase.initializeApp(config);

var database = firebase.database();


// ################################################################# //
// ######	                     MODULE                         #### //
// ################################################################# //

module.exports = {

    //
    //      FUNCTION to write data to database
    //
    writeDeviceData: function( userID, alias, mac, ip, state, info ) {
        mac = mac.toLowerCase();
        plugRef = database.ref( '/user-plugs/' + userID + '/' + mac );
        plugRef.set( {
            alias: alias,
            mac: mac,
            ip : ip,
            state : state,
            info: info,
        }, function(){
            database.goOffline();
           
        });
    },

    /// 
    ///		FUNCTION to get <device ip> from firebase by input <plugname>
    ///		return as JSON <.status> and <.ip>
    readDeviceDataFromAlias: function( userID, plugname, callback ) {
        var result = '';
        plugRef = firebase.database().ref('/user-plugs/' + userID);
        plugRef.once('value', function (snap) {
            snap.forEach(function (childSnap) {
                if(childSnap.val().alias == plugname) {
                    deviceIP = childSnap.val().ip;
                    result = {
                        'status': true,
                        'alias': plugname,
                        'ip': deviceIP
                    }
                    callback(result, database);
                }
            });
            if( result == '' ) {
                 // if plug not found
                result = {
                    'status': false,
                    'alias': plugname,
                    'ip': ''
                }
                callback(result, database);
                database.goOffline();
            }
        });
    },

    updateDeviceStateFromMac: function( userID, mac, state, callback ) {
        mac = mac.toLowerCase();
        plugRef = database.ref( '/user-plugs/' + userID  + '/' + mac + '/' + 'state' );
        plugRef.set( state, function() {
            
            callback( 1 )
            database.goOffline();
        });
    }
}