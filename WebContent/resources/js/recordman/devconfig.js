$(function(){
	setNavActive('nav_devconf');
	
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
	
	$('#eth_save').click(function(){
		var param={};
		param.index = getActiveIndex();
		param.name = $('#eth_name').val();
		param.ip = getipvalue('#eth_ip');
		param.mask = getipvalue('#eth_netmask');
		param.gate = getipvalue('#eth_gate');
		if( param.index > 100 ){
			param.protocol = $('#eth_protocolname').val();
			param.port = $('#eth_protocolport').val();
		}
		var dataParam = {
			    url: rootPath + "/devparam/devconfig/updateethernet",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							$("#editEthernetModal").modal('hide');
							if( param.index > 100 ){
								showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));	
								fillEthernets();
							}else{
								applydfu(doResult);
							}							
						}else{
							showAlert($.i18n.prop('oper_fail'), $.i18n.prop(data.reason));
						}					
					}else{
						showAlert($.i18n.prop('oper_fail'), $.i18n.prop('exceptionerror'));
					}					
				}
		};
		getAjaxData(dataParam,false);
		return false;
	});
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

function fillEthernets(){
	var param={};
	var dataParam = {
		    url: rootPath + "/devparam/devconfig/getethernets",
			param:param,
			call: function(data) {
				if(data!=null && data.ethernets!=null) {
					var html = '';
					var acModule = getCookie('etherentIndex');
					var activeItem = '';
					for(var i=0; i < data.ethernets.length; i++){
						var m = data.ethernets[i];
						if( 0 == i ){
							activeItem = m.index;
						}
						if( acModule != '' && m.id == acModule){
							activeItem = m.index;
						}						
						html += "<a id='"+m.index+"' class='list-group-item' ondblclick=\"editEthernet("+m.index+")\")>";
						html += "<h5 class='list-group-item-heading'>"+m.name+"</h5>";
						html += "<span class='list-group-item-text'>"+m.ip+"/"+m.mask+"</span>";						
						html += "<button class='customBtn editBtn' title='"+$.i18n.prop('edit')+"' onclick=\"editEthernet("+m.index+")\"> </button></a>";
					}
					$('.ethernets .list-group').html(html);
					if( activeItem != '' ){
						setCursel(activeItem);
					}
					$('.ethernets .list-group').children().click(function(event){
						$('.list-group').children().removeClass('active');
						
						var item = event.target;
						if( false == $(item).hasClass('list-group-item') ){
							item = $(item).parent();
						}
						$(item).addClass('active');
						saveCurIndex($(item).attr('id'));
					});
				}
			}
	};
	getAjaxData(dataParam,false);
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
		fillEthernets();
	}else if( data.result == 1 ){
		showAlert($.i18n.prop('oper_success'), $.i18n.prop('dfuconf_apply_success'));
	}
}