var util = require('util');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var functionHelper = require( './functionHelper' );
const { Client } = require('tplink-smarthome-api');

const client = new Client();


var userKey = 'QWERTY1234';

var ONE_SECOND = 1000;
var ONE_MINUTE = ONE_SECOND * 60;
var FIVE_MINUTE = ONE_MINUTE * 5;

/***************************************************
 * Function -> eventEmitter
 ****************************************************/
var getCurrentTime = function() {
  var now = moment();
  let dateStr = now.format('YYYY-MM-DD hh:mm:ss');
  let Y = now.year();
  let M = now.month();
  let D = now.date();
  let h = now.hour();
  let m = now.minute();
  let s = now.second();

  return [dateStr, Y, M, D, h, m, s];
}

var Main = async function() {

  plugData = await functionHelper.initPlugData(userKey);

  plugData.forEach(data => {
    console.log(data.ip);
    client.getDevice({host: data.ip})
    .then((device)=>{
      var thisInterval = setInterval( function() {
        let oldCons = {total:0};
        device.emeter.getRealtime()
        .then((cons)=>{
          
          let unit = cons.total - oldCons.total;

          let time = getCurrentTime();
          let sql = 'INSERT INTO `consumption_tb_copy1` VALUES(NULL,"'+userKey+'","'+data.plugId+'",'+unit+','+cons.total+
                    ',"'+time[0]+'",'+time[1]+','+time[2]+','+time[3]+','+time[4]+','+time[5]+','+time[6]+')';
          functionHelper.updateData(sql).catch();
          console.log(cons);

          oldCons = cons;

        })
        .catch((e)=>{ 
          console.log('Stop interval');
          clearInterval(thisInterval);
        });
      }, ONE_MINUTE );
    })
    .catch((e)=>{
      console.log('Here');
      //console.log(e);
    });
  });
}

Main();
// var getConsumption = async function(userKey, ip) {
//   consumption = await functionHelper.getConsumption(userKey, ip);
//   return consumption;
// }

// var pushConsumption = async function(){
//   const plug = client.getDevice({host: ip})
//     .then((device)=>{
      
//       device.emeter.getRealtime()
//       .then((cons)=>{
//         console.log(cons);
//       })
//       .catch(console.log);
//     })
//     .catch(console.log);
// }

// plugData = initPlug(userKey).then((data)=>{
//   console.log(data);
// });


// var Ticker = function() {
//   var self = this;
//   setInterval(function() {
    


//   }, 1000);
// };

// // Bind the new EventEmitter to the sudo class.
// util.inherits(Ticker, EventEmitter);


// var tickerEmitter = new Ticker();
 
// var tickListenerFunc = function() {
//   console.log('Tick');
// };
// tickerEmitter.on('push', tickListenerFunc);

// (function tock() {
//   setTimeout(function() {
//     tickerEmitter.removeListener('push', tickListenerFunc);
//   }, 5000);
// })();