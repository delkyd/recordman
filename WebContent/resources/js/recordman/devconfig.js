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
	});
	var ethIndex = getCookie('etherentIndex');
	setCursel( ethIndex==''?-1:parseInt(ethIndex));
	
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
	$('#eth_name').val('');
	clearipvalue('#eth_ip');
	clearipvalue('#eth_netmask');
	clearipvalue('#eth_gate');
	$('#protocolgroup').hide();
	$('#portgroup').hide();
}

function editEthernet(index){
	clearDetail();
	var param={};
	param.index=index;
	var dataParam = {
		    url: rootPath + "/devparam/devconfig/findethernet",
			param:param,
			call: function(data) {
				if(data!=null) {
					$('#eth_name').val(data.name);
					setipvalue('#eth_ip', data.ip);
					setipvalue('#eth_netmask', data.mask);
					setipvalue('#eth_gate', data.gate);
					if( index > 100 ){
						$('#protocolgroup').show();
						$('#portgroup').show();
						$('#eth_protocolname').val(data.protocol);
						$('#eth_protocolport').val(data.port);
					}
					$("#editEthernetModal").modal('show');
				}
			}
	};
	getAjaxData(dataParam,false);
}

function update(){
	var param={};
	param.name=$('#dev_name').val();
	param.model=$('#dev_model').val();
	param.station = $('#station_name').val();
	param.version = $('#dev_version').val();
	param.remark = $('#dev_remark').val();
	var dataParam = {
		    url: rootPath + "/devparam/devconfig/update",
			param:param,
			call: function(data) {
				if(data!=null && data.result != null) {
					if( data.result ){
						applydfu(doResult);
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

function doResult(result, data){
	if( data.result == 0 ){
		showAlert($.i18n.prop('oper_fail'), $.i18n.prop('dfuconf_apply_fail'));
	}else if( data.result == 1 ){
		showAlert($.i18n.prop('oper_success'), $.i18n.prop('dfuconf_apply_success'));
	}
}