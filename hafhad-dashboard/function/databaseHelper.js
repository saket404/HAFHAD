var mysql = require('mysql');

var googleDatabaseConfig = {
  host: "35.189.145.19",
  user: "test",
  password: "1234",
  database: "hafhad_db",
}

/*********************************************************
*   Check login
**********************************************************/
function getUserKeyFromLogin(email, password){
  let connection = mysql.createConnection( googleDatabaseConfig );
  console.log( email + ' ' + password )
  try{

    return new Promise((resolve, reject) => {

      //  Query database
      connection.query('SELECT userKey FROM `user_tb` WHERE email="'+email+'" AND password = "'+password+'"', function (error, results, fields) {
        
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
    //  Close connection
    connection.end();
  }

}


/*********************************************************
* GET user data from input Key
  RETURN - [ RowDataPacket{ ... } ]
         - [] if no match
         - error if error
**********************************************************/
function getUserDataFromUserKey(key) {
  let connection = mysql.createConnection( googleDatabaseConfig );
  console.log("Connect to database...")
  
  try{

    return new Promise((resolve, reject) => {

      //  Query database
      connection.query('SELECT * FROM `user_tb` WHERE userKey="'+key+'"', function (error, results, fields) {
        
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
    //  Close connection
    console.log("End connection...")
    connection.end();
  }
  
}

/*********************************************************
* GET plug data from input user Key
  RETURN - [ RowDataPacket{ ... } ]
         - [] if no match
         - error if error
**********************************************************/
function getPlugFromUserKey(key) {
  let connection = mysql.createConnection( googleDatabaseConfig );
  console.log("Connect to database...")
  
  try{

    return new Promise((resolve, reject) => {

      //  Query database
      connection.query('SELECT * FROM `plug_tb` WHERE userKey="'+key+'"', function (error, results, fields) {
        
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
    //  Close connection
    console.log("End connection...")
    connection.end();
  }
  
}

/*********************************************************
* GET icon mapping
  RETURN - 
**********************************************************/
function getIconDeviceMapping(){

  var iconMap = {}

  let connection = mysql.createConnection( googleDatabaseConfig );
  
  try{

    return new Promise((resolve, reject) => {

      //  Query database
      connection.query('SELECT * FROM `devicetype_tb`', function (error, results, fields) {
        
        if(error)
          reject(error);

        else{
          results.forEach(icon => {
            iconMap[icon.id] = icon.icon
          });
          resolve(iconMap);
        }
          
      });
    });

  }
  finally{
    //  Close connection
    connection.end();
  }
}

/*********************************************************
*  Set state of plug online
**********************************************************/
function setPlugState( userKey, mac, state ){

  let connection = mysql.createConnection( googleDatabaseConfig );

  try{
    return new Promise((resolve, reject) => {
      connection.query('UPDATE `plug_tb` SET state = '+state+' WHERE mac = "'+mac+'" AND userKey = "'+userKey+'"', function (error, result) {
        if(error) reject(error);
        else resolve(true);
      });
    });
  }
  finally{
    //  Close connection
    connection.end();
  }
  
}

/*********************************************************
*   Update
**********************************************************/
function updateDatabase( table, columns, datas, where ){
  let connection = mysql.createConnection( googleDatabaseConfig );
  
      try{
        return new Promise((resolve, reject) => {
          var sql = 'UPDATE `'+table+'` SET';
          
          for (const key in columns) {
            if (columns.hasOwnProperty(key) && datas.hasOwnProperty(key)) {
              if(key != 0)
                sql += ','
              sql += ' '+columns[key]+' = "'+datas[key]+'" ';
            }
          }

          sql += where;

          connection.query(sql, function (error, result) {
            if(error) reject(error);
            else resolve(true);
          });
        });
      }
      finally{
        //  Close connection
        connection.end();
      }
}
/*********************************************************
*   Get data
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


exports.getUserKeyFromLogin = getUserKeyFromLogin;
exports.getUserDataFromUserKey = getUserDataFromUserKey;
exports.getPlugFromUserKey = getPlugFromUserKey;

exports.getIconDeviceMapping = getIconDeviceMapping;

exports.setPlugState = setPlugState

// DB helper
exports.updateData = updateData
exports.updateDatabase = updateDatabase
exports.getData = getData

exports.writeDeviceData = writeDeviceData
exports.readDeviceDataFromAlias = readDeviceDataFromAlias
exports.updateDeviceStateFromMac = updateDeviceStateFromMac