$(function(){
	setNavActive('nav_network');
	$('.ip_input .item').keydown(onipitemkeydown);
	$('.ip_input .item').keyup(onipitemkeyup);
	setipvalue('#ip', '192.168.116.5');
});

function setipvalue(obj, ip){
	var ips = ip.split('.');
	var inputs = $(obj).children('.item');
	if( inputs.length == 4 && ips.length == 4 ){
		for(var i=0; i < 4 ; i++ ){
			$(inputs[i]).val(ips[i]);
		}
	}
}

function onipitemkeydown(e){
	
}

function onipitemkeyup(e){
	this.value=this.value.replace(/[^0-9]+/,'');
	var v = parseInt(this.value);
	if( this.value.length > 1 ){
		this.value=v;
	}
	if( v > 255 ){
		this.value=this.value.substr(0,this.value.length-1);
	}

	if( (3 == this.value.length && ( e.keyCode >= 48 && e.keyCode <=57)) ||
			(( e.keyCode == 190 && this.value != '') && e.keyCode != 8)){
		if( $(this).next() ){
			$(this).next().focus();
		}
	}

	if( (e.keyCode == 8) && this.value.length==0){
		if( $(this).prev() ){
			$(this).prev().focus();
		}
	}
}