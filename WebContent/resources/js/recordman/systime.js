$(function(){
	setNavActive('nav_sys');
	$('.ip_input .item').keyup(onipitemkeyup);
	$('#datetimepicker1').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss',
		sideBySide: true
	});
});