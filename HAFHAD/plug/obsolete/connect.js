
var roomSSID 	= 'CAGD R_Lab';
var roomPass 	= 'rabbit999';
var myALIAS     = 'ห้องนอน';

var firebaseController = require("./firebaseController.js");
var plugSetting = require("./connectPlug.js")

plugSetting.settingDevice( roomSSID, roomPass, myALIAS, function( status ){
    console.log('status:' + status);
});
