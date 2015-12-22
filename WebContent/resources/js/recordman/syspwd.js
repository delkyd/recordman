$(function(){
	setNavActive('nav_sys');
	$('#okbtn').click(updateUser);
});

function updateUser(){
	$('#oldpwd').parent().parent().removeClass('has-error');
	$('#newpwd').parent().parent().removeClass('has-error');
	$('#newpwd-confirm').parent().parent().removeClass('has-error');
	
	var newpwd = $('#newpwd').val();
	var newpwd1 = $('#newpwd-confirm').val();
	
	if( newpwd != newpwd1 ){
		$('#newpwd').parent().parent().addClass('has-error');
		$('#newpwd-confirm').parent().parent().addClass('has-error');
		return;
	}
	
	var param={};
	param.name = $('#name').val();
	param.oldpwd=$('#oldpwd').val();
	param.pwd = $('#newpwd').val();
	
	var dataParam = {
			url : rootPath + "/system/syspwd/edit",
			param : param,
			call : function(data){
				if( data ){
					if( data.result ){
						showAlert($.i18n.prop('oper_success'), $.i18n.prop('updatepwd_succ'), relogin);
					}else{
						if( 1 == data.errorCode){
							showAlert($.i18n.prop('oper_fail'), $.i18n.prop('updatepwd_error_1'));
							$('#oldpwd').parent().parent().addClass('has-error');
						}else if( 2 == data.errorCode){
							showAlert($.i18n.prop('oper_fail'), $.i18n.prop('updatepwd_error_2'));
						}else{
							showAlert($.i18n.prop('oper_fail'), $.i18n.prop('unknownerror'));
						}						
					}
				}else{
					showAlert($.i18n.prop('oper_fail'), $.i18n.prop('exceptionerror'));
				}
			},
			error:function(){
				showAlert($.i18n.prop('oper_fail'), $.i18n.prop('neterror'));
			}
	};
	getAjaxData(dataParam);
}