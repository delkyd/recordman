(function(){
	centerLoginForm();
	$(window).resize(centerLoginForm);

})();

function centerLoginForm(){	
	var formw = Math.min( $('#content').width() * 0.9, parseInt($('#loginform').css('max-width')) );
	$('#loginform').width(formw+'px');
	$('#loginform').css('margin-left',-formw/2+'px')
}

function validLogin(){
	if( $('#name').val().length == 0 ){
		$('#name').focus();
		$('#tipMsg').text('请填写用户名');		
		return false;
	}
	if( $('#pwd').val().length == 0 ){
		$('#pwd').focus();
		$('#tipMsg').text('请填写密码');		
		return false;
	}
	return true;
}