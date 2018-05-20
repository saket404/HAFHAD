
var notificationTable

$(document).ready(function() {

  /**************************************
    *  NOTIFICATION TABLE
    **************************************/
  notificationTable = $('#notificationTable').DataTable( {
    // Get data from ajax at url ...
    ajax: {
      url: "ajax/getNotification",
      dataSrc: "data"
    },
    order: [[ 0, "desc" ]],
    // Not show unnesessary element on table
    columnDefs: [
      { targets: [ 0 ], visible: false, searchable: false },
    ],
    pageLength: 6, info: false, lengthChange: false, searching: false,
    // String to display when there is no data
    language: { emptyTable: 'No Notification' },
  } );

});