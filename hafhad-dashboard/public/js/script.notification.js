
var notificationTable

/// WARNING :: THIS FUNCTION STILL USE FIREBASE HELPER
function changeAckState( rowId ){
  var data = notificationTable.row( rowId ).data();
  var reqData = { id:data[0], isAck: data[4] };
  
  //  Get data for table then reload
  $.post('./ajax/changeAckState', reqData, function( res ){
    notificationTable.ajax.reload();
  });

}

$(document).ready(function() {

  /**************************************
    *  NOTIFICATION TABLE
    **************************************/
  notificationTable = $('#notificationTable').DataTable( {
    // Get data from ajax at url ...
    ajax: {
/// WARNING :: THIS FUNCTION STILL USE FIREBASE HELPER
      url: "ajax/getNotification",
      dataSrc: "data"
    },
    order: [[ 0, "desc" ]],
    // Not show unnesessary element on table
    columnDefs: [
      { targets: [ 0 ], visible: false, searchable: false },
      { targets: [ 4 ], visible: false, searchable: false },
    ],
    pageLength: 6, info: false, lengthChange: false, searching: false,
    // String to display when there is no data
    language: { emptyTable: 'No Notification' },
  } );

});