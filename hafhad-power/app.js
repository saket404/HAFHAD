var functionHelper = require( './functionHelper' );

var userKey = 'QWERTY1234';

// async function pushConsumption(){
//   let plugData = await ...;
//   plugData.forEach(plug => {
//     let consumption = await functionHelper.getConsumption(plug.ip);
//     pushConsumption(plug.ip);
//   });
// }

// let plugData = functionHelper.initPlugData(userKey)
//   .then((data)=>{
//     // data.forEach(plug => {
//     //   console.log(plug.ip);
//     // });
//   })
//   .catch();

// console.log(plugData);
functionHelper.repeatPushConsumption(userKey, '192.168.1.135')
