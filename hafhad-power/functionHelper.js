const mysql = require('mysql');
const { Client } = require('tplink-smarthome-api');

const client = new Client();

var googleDatabaseConfig = {
  host: "35.189.145.19",
  user: "test",
  password: "1234",
  database: "hafhad_db",
}

// ################################################################# //
// ######	                     FUNCTION                         #### //
// ################################################################# //

/*********************************************************
*   GET data
**********************************************************/
function getData(sql){
  let connection = mysql.createConnection(googleDatabaseConfig);
  try{
    return new Promise((resolve, reject) => {
      connection.query(sql, (error, results, fields) => {
        if(error)
          reject(error);
        else if(!results.length)
          resolve([]);
        else
          resolve(results);
      });
    });
  }
  finally{
    connection.end();
  }
}

/*********************************************************
*   UPDATE data
**********************************************************/
function updateData(sql){
  let connection = mysql.createConnection( googleDatabaseConfig );
  
  try{
    return new Promise((resolve, reject) => {
      connection.query(sql, function (error, result) {
        if(error) reject(error);
        else resolve(true);
      });
    });
  }
  finally{
    connection.end();
  }
}

/*********************************************************
*   Repeat function
**********************************************************/
function repeatEvery(func, interval) {

  var now = new Date()
  var delay = interval - now % interval;

  function start() {
    func();
    setInterval(func, interval);
  }

  setTimeout(start, delay);
}

/*********************************************************
*  
**********************************************************/
async function initPlugData(userKey){
  let sql = 'SELECT plugId, alias, ip, mac FROM `plug_tb` WHERE userKey = "'+userKey+'" AND isValid = 1';
  let data = await getData(sql);

  return new Promise((resolve, reject) => {
    if(!data.length)
      reject(false);
    else
      resolve(data);
  });
}

/*********************************************************
*  
**********************************************************/
async function writeDeviceData(userKey, alias, mac, ip, state, type){
  mac = mac.toLowerCase();

  let sql = 'INSERT INTO `plug_tb` ';
      sql+= 'VALUES(NULL';
      sql+= ',"'+userKey+'"';
      sql+= ',"'+alias+'"';
      sql+= ',"'+mac+'"';
      sql+= ',"'+ip+'"';
      sql+= ','+state;
      sql+= ',1';
      sql+= ','+type;
      sql+= ',NULL',
      sql+= ')';

  await updateData(sql);
}

async function readDeviceDataFromAlias(userKey, alias){
  let sql = 'SELECT mac, ip, alias, state, isValid FROM `plug_tb` WHERE userKey="'+userKey+'" AND alias="'+alias+'"';
  let data = await getData(sql);

  return new Promise((resolve, reject) => {
    if(!data.length)
      reject(false);
    else
      resolve(data);
  });

}

async function updateDeviceStateFromMac(userKey, mac, state){
  mac = mac.toLowerCase();
  let sql = 'UPDATE `plug_tb` SET state = '+state+' WHERE userKey="'+userKey+'" AND mac="'+mac+'"';

  await updateData(sql);
}



// ################################################################# //
// ######	                     MODULES                          #### //
// ################################################################# //

// DB helper
exports.updateData = updateData
exports.getData = getData

// Function helper
exports.repeatEvery = repeatEvery

// Plug Helper
exports.initPlugData = initPlugData
