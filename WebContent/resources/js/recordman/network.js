$(function(){
	setNavActive('nav_setup');

	$('.ip_input .item').keyup(onipitemkeyup);
	$('#toggle').bootstrapToggle('on')
	setipvalue('#ip', '192.168.116.5');
	setipvalue('#netmask', '255.255.255.0');
	setipvalue('#broadcast', '192.168.116.255');
	setipvalue('#network', '192.168.116.1');
});

