$(function(){
	setNavActive('nav_setup');
	$('.list-group').children().click(function(event){
		$('.list-group').children().removeClass('active');
		
		var item = event.target;
		if( false == $(item).hasClass('list-group-item') ){
			item = $(item).parent();
		}
		$(item).addClass('active');
		saveCurIndex($(item).attr('id'));
		fillDetail();
	});
	var ethIndex = getCookie('etherentIndex');
	setCursel( ethIndex==''?-1:parseInt(ethIndex));
	
	fillDetail();
	
	$('.ip_input .item').keyup(onipitemkeyup);
});

function saveCurIndex(index){
	setCookie('etherentIndex', index);
}

function setCursel(curselIndex){
	$('.list-group').children().removeClass('active');
	//if cursel==-1, select the first item.else select the specific item
	if( -1 == curselIndex ){
		var child = $('.list-group .list-group-item').first();
		
	}else{
		var child = $(".list-group .list-group-item[id='"+curselIndex+"']");
	}
	if( child != null ){
		saveCurIndex(child.attr('id'));
		child.addClass("active");
	}
}

function getActiveIndex(){
	return $('.list-group .list-group-item.active').attr('id');
}

function clearDetail(){
	$('#name').val('');
	clearipvalue('#ip');
	clearipvalue('#netmask');
	clearipvalue('#gate');
}

function fillDetail(){
	clearDetail();
	var index = parseInt(getActiveIndex());
	var param={};
	param.index=index;
	var dataParam = {
		    url: rootPath + "/devparam/network/find",
			param:param,
			call: function(data) {
				if(data!=null) {
					$('#name').val(data.name);
					setipvalue('#ip', data.ip);
					setipvalue('#netmask', data.mask);
					setipvalue('#gate', data.gate);					
				}
			}
	};
	getAjaxData(dataParam,false);
}

function update(){
	var index = parseInt(getActiveIndex());
	var param={};
	param.index=index;
	param.name=$('#name').val();
	param.ip=getipvalue('#ip');
	param.mask=getipvalue('#netmask');
	param.gate=getipvalue('#gate');
	var dataParam = {
		    url: rootPath + "/devparam/network/update",
			param:param,
			call: function(data) {
				if(data!=null && data.result != null) {
					if( data.result ){
						showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
					}else{
						showAlert($.i18n.prop('oper_fail'), $.i18n.prop(data.reason));
					}					
				}else{
					showAlert($.i18n.prop('oper_fail'), $.i18n.prop('exceptionerror'));
				}
			}
	};
	getAjaxData(dataParam,false);
}

