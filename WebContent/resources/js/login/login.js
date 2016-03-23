(function(){
	centerLoginForm();
	$(window).resize(centerLoginForm);
	loadProperties();
	$('#pwd').removeAttr('disabled');
	$('#pwd').focus();
	
	$('#name').change(function(){
		var user=$('#name').val();
		if( user == 'admin' ){
			$('#tipMsg').text($.i18n.prop('tip_login'));
			$('#pwd').removeAttr('disabled');
			$('#pwd').focus();
		}else if( user == 'guest'){
			$('#tipMsg').text($.i18n.prop('tip_guest'));
			$('#pwd').attr('disabled','disabled');
		}
	});
})();

function centerLoginForm(){	
	var fh = $("#footer").height();
	var wh = $(window).height();
	$('#content').css('min-height', (wh - fh)+'px');
	
	var formw = $('#loginform').width();
	var formh = $('#loginform').height();
	var parentw = $('#loginform').parent().width();
	var parenth = $('#loginform').parent().height();
	
	$('#loginform').css('left',(parentw/2-formw/2)+'px');
	$('#loginform').css('top',(parenth/2-formh/2)+'px')
}

function validLogin(){
	/*if( $('#name').val().length == 0 ){
		$('#name').focus();
		$('#tipMsg').text($.i18n.prop('tip_inputname'));		
		return false;
	}*/
	var user=$('#name').val();
	if( $('#pwd').val().length == 0 && user == 'admin'){
		$('#pwd').focus();
		$('#tipMsg').text($.i18n.prop('tip_inputpwd'));		
		return false;
	}
	return true;
}

function loadProperties(){
	jQuery.i18n.properties({
		name:'i18nstring',
		path:'./resources/js/i18n/',
		mode:'map'	
	});
}