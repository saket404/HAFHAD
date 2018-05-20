

var plugHelper = require('../../hafhad-dashboard/function/plugHelper');
var databaseHelper = require( '../../hafhad-dashboard/function/databaseHelper' )


// READ UserKey
var config = require('../modules/data/user.json');
var userKey = config.users[0].key
var command;
var device1 = '';
var device2 = '';

//process.argv = ['open,ห้องนอน,ห้องครัว'];

/// SPLIT ARGS
process.argv.forEach(function(index) {
  index = 'close,ห้องนอน,ตู้เย็น';
	var words = index.split(',');

	if ( words.length > 1 ){
		/*  check command open/close */
		if( words[0] == 'open' )
			command = true;
		else if( words[0] == 'close' )
			command = false;
		else
      return 0;
      
		/*  let alias = name1 */
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

/// DO COMMAND

function searchDeviceThenSetState( userKey, alias, command ){
	if( alias != '' ) {
		var sql = 'SELECT ip FROM `plug_tb` WHERE alias = "'+alias+'" AND userKey = "'+userKey+'"';

		return new Promise((resolve, reject) => {
			databaseHelper.getData(sql).then(async (res)=>{
				
				if(res.length == 0){
					returnToPython = 'ไม่มีdeviceชื่อ'+ alias;
					resolve(returnToPython);
				}
				else{
					var ip = res[0].ip;
					let s = 	command ? 1:0;
					let sql = 'UPDATE plug_tb SET state='+ s +' WHERE ip="'+ip+'"';
					plugHelper.setPlugState(ip, command, async(e)=>{
						
						if(e){
							await databaseHelper.updateData( sql );
							returnToPython = alias + 'สำเร็จ';
							resolve(returnToPython);
						}
						else{
							returnToPython = 'ไอพีของdevice'+alias+'ผิดพลาด';
							reject(returnToPython);
						}
					});
				}
			});
		});
	}
}

(async function (){
	var return1 = '', return2 = '';
	if( device1 != '' )
		return1 = await searchDeviceThenSetState( userKey, device1, command )
		.then((res)=>{
			console.log(res);
		})
		.catch((e)=>{
			console.log(e);
		});

	if( device2 != '' )
		return2 = await searchDeviceThenSetState( userKey, device2, command )
		.then((res)=>{
			console.log(res);
		})
		.catch((e)=>{
			console.log(e);
		});
})();