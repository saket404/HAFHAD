
/*********************************************************
* Click event
**********************************************************/
$('#login_btn').click( ()=>{
	let email = $('#email').val();
	let password = $('#password').val();

	var reqData = { email:email, password:password };

	$.post('./ajax/login', reqData, (data) => {
		if(typeof data.redirect == 'string')
      window.location = data.redirect
	} );
});

$('body').css(
	{
		'background-color':'#9c27b0'
	}
)