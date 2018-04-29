
var deviceTable;
var allDeviceTable;

function changeState_cb( rowId ){
  // - Called when push button

  //  Get data of row X
  var data = deviceTable.row( rowId ).data();
  var newState = data[5] == 1 ? 0 : 1;
  var reqData = { mac:data[3], ip:data[4], state:newState };

  //  Get data for table then reload
  $.post('./ajax/changeDeviceState', reqData, function( res ){
    if(!res)
      callNotify( 'Can\'t set state, Please check plug connection.', 'warning', 'top', 'right' );
    deviceTable.ajax.reload();
  });
}

/// WARNING :: THIS FUNCTION STILL USE FIREBASE HELPER
function setDeviceIconPill(){
  $.get('./ajax/getDeviceIcon', {}, (res) =>{
    if( res != [] ){
      var html = ''
      res.forEach(data => {
        var icon = '<i class="material-icons"> ' + data.icon + ' </i>';
        var li = '<li class="nav-item"> <a class="nav-link" href="#" role="tab" data-toggle="tab" aria-selected="false" data-device="' + data.label + '"> '+ icon +' </a> </li>';
        html += li
      });
      $('#devicetype_ul').html( html );
    }
  } );
}

///////////////////////////////////////////
////    DOC READY
///////////////////////////////////////////
$(document).ready(function() {

  setDeviceIconPill();

  /**************************************
  *  BUTTON
  **************************************/
  $('#addDevice_btn').click( () => {

    var deviceName =  $('#devicename_input').val();
    var deviceType = $('ul#devicetype_ul').find('a.active').data('device');

    // Check input name
    if(deviceName == '') {
      callNotify( 'Enter plug name', 'info', 'top', 'right' );
      return
    }
    // Check input type
    if(deviceType == undefined) {
      callNotify( 'Select plug icon', 'info', 'top', 'right' );
      return
    }
    var reqData = { alias:deviceName, type:deviceType };

    // Change button text
    $addDevice_btn = $('#addDevice_btn');
    $addDevice_btn.html('...');
    $addDevice_btn.prop('disabled', true);
    callNotify( 'Processing...', 'info', 'top', 'right' );

    // Call AJAX
    $.get('./ajax/setNewPlug', reqData, function( res ){
      if(res === false)
        callNotify( 'Cannot add plug', 'warning', 'top', 'right' );
      else{
        callNotify( 'Added plug', 'success', 'top', 'right' );
        deviceTable.ajax.reload();
      }
      // Change button text back
      $addDevice_btn.html('Add Device');
      $addDevice_btn.prop('disabled', false);
    });
  });

  $('#refreshPlug_btn').click( function(){
      
    // call update plug
/// WARNING :: NOT IMPLEMENT

    // call ajax reload on table
    deviceTable.ajax.reload();

    // notify
    callNotify( 'Refresh successfully.', 'primary', 'top', 'right' );

  });
  
  /**************************************
  *  PLUG TABLE
  **************************************/
  deviceTable = $('#device_table').DataTable( {
    // Get data from ajax at url ...
    ajax: {
      url: "ajax/getDeviceTableData?all=false",
      dataSrc: "data"
    },
    // Hide column 3,4,5 which are mac,ip,state
    columnDefs: [
      { targets: [ 3 ], visible: false, searchable: false },
      { targets: [ 4 ], visible: false, searchable: false },
      { targets: [ 5 ], visible: false, searchable: false }
    ],
    // Set column width
    columns: [
      { width: "20%" },
      { width: "65%" },
      { width: "15%" },
    ],
    // Not show unnesessary element on table
    pageLength: 3, info: false, lengthChange: false, searching: false, ordering: false,
    // String to display when there is no data
    language: { emptyTable: 'No device' },
  } );

} );

