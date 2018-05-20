var slider = document.getElementById('ratioSlider');
var sliderValueElement = document.getElementById('sliderRangeValue');

//*************************************************** */
//**********             SLIDER
noUiSlider.create(slider, {
	start: 0.75,
	connect: [true,false],
	range: {
		min: 0.5,
		max: 1
	}
});

slider.noUiSlider.on('update', function( values, handle ) {
	sliderValueElement.innerHTML = values[handle];
});

//*************************************************** */
//**********       SET VALUE INPUT TEXT

$(document).ready(function() {
  $.post('./ajax/getAccountData', (data)=>{
    if(data.length > 0){
      let d = data[0];
      $('#username_input').val(d.name);
      $('#useremail_input').val(d.email);
      $('#userpassword_input').val(d.password);
      $('#useraddress_input').val(d.address);

      $('#email').val(d.email_id);
      $('#password').val(d.email_password);

      $('#apiKey').val(d.apiKey);
      $('#apiSecret').val(d.apiSecret);

      slider.noUiSlider.set(d.ratio);
    }
    console.log(data);
  });
});


//*************************************************** */
//**********             BUTTON

$('#updateInfo_btn').click( ()=>{

  var reqData = { 
    name: $('#username_input').val(), 
    email: $('#useremail_input').val(), 
    password: $('#userpassword_input').val(), 
    address: $('#useraddress_input').val() 
  };

  // Post to update
  $.post('./ajax/updateInfoData', reqData );
  
  callNotify( 'Data is Updated', 'success', 'top', 'right' );
  setTimeout(() => {
    window.location = '/account';
  }, 2000);
  
});

$('#updateNoti_btn').click( ()=>{

  var reqData = { email: $('#email').val(), password: $('#password').val() };

  // Post to update
  $.post('./ajax/updateNotiData', reqData );
  callNotify( 'Data is Updated', 'success', 'top', 'right' );
  setTimeout(() => {
    window.location = '/account';
  }, 2000);
});

$('#updateApi_btn').click( ()=>{

  var reqData = { clientId: $('#apiKey').val(), clientSecret: $('#apiSecret').val() };

  // Post to update
  $.post('./ajax/updateApiData', reqData );
  callNotify( 'Data is Updated', 'success', 'top', 'right' );
  setTimeout(() => {
    window.location = '/account';
  }, 2000);
});

$('#updateRatio_btn').click( ()=>{

  var reqData = { ratio: slider.noUiSlider.get() };

  // Post to update
  $.post('./ajax/updateRatioData', reqData );
  callNotify( 'Data is Updated', 'success', 'top', 'right' );
  setTimeout(() => {
    window.location = '/account';
  }, 2000);
});