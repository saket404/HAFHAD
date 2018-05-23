var myLineChart;
var option = {}

$(document).ready(function() {
  // reqData = { ip: '192.168.1.135'};

  // repeatEvery(()=>{
    // $.post('/ajax/getRealtimeData', reqData, (realtime)=>{
    //   console.log('FRONT: ' + realtime);
    // });
  // }, 5000);

  $('#refreshChart_btn').click( function(){

    var startDate =  $("#startDateRange").data("DateTimePicker").date(); 
    var endDate =  $("#endDateRange").data("DateTimePicker").date();

    var startDate = moment(startDate).format("YYYY-MM-DD");
    var endDate = moment(endDate).format("YYYY-MM-DD");
   
    $('#refreshChart_btn').html('...');
    $('#refreshChart_btn').prop('disabled', true);

    // call ajax reload chart
    $.get('/ajax/getChartData', (conData)=>{
      // var xLabel = [];
      // var energy = [];
      var xMiniLabel = [];
      var miniEnergy = [];
      conData.forEach(con => {
        xMiniLabel = [];
        miniEnergy = [];
        con.con.forEach(day => {
          xMiniLabel.push(day.year+'-'+day.month+'-'+day.day);
          miniEnergy.push(day.energy);
        });
        // xLabel.push(xMiniLabel);
        // energy.push(miniEnergy);
        s = {
          label: con.alias,
          data: miniEnergy,
          fill: false
        };

        myLineChart.data.datasets.push(s);
      });
      myLineChart.data.labels = xMiniLabel;
      myLineChart.update();
      $('#refreshChart_btn').html('Go');
      $('#refreshChart_btn').prop('disabled', false);
      callNotify( 'Refresh successfully.', 'primary', 'top', 'right' );
    });
  });


  /**************************************
  *  CHART
  **************************************/
  myLineChart = new Chart( 'line_chart' , {
    type: 'line',
    option: option
  });

  /**************************************
  *  Datetime
  **************************************/
  $('.datetimepicker').datetimepicker({
    icons: {
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-chevron-up",
      down: "fa fa-chevron-down",
      previous: 'fa fa-chevron-left',
      next: 'fa fa-chevron-right',
      today: 'fa fa-screenshot',
      clear: 'fa fa-trash',
      close: 'fa fa-remove'
    },
    format: 'DD/MM/YYYY'
  });

  $("#startDateRange").on("dp.change", function (e) {
      $('#endDateRange').data("DateTimePicker").minDate(e.date);
  });
  $("#endDateRange").on("dp.change", function (e) {
      $('#startDateRange').data("DateTimePicker").maxDate(e.date);
  });

});