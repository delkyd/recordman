$(function(){
	setNavActive('nav_channelctrl');
	
	$('#channeltype_group input').change(function(){
		fillTables();
	});
	$('#board_group input').change(function(){
		fillTables();
	});
	fillTables();
});

function getSelType(){
	var typeId = $('#channeltype_group input:checked').attr('id');
	if( typeId == 'channeltype_ai'){
		return CONST.CHANNEL_TYPE.AI;
	}else{
		return CONST.CHANNEL_TYPE.DI;
	}
}

function getSelBoard(){
	var board = $('#board_group input:checked').attr('id');
	typeId = getSelType();
	if( typeId == CONST.CHANNEL_TYPE.AI){
		return parseInt(board);
	}else{
		return CONST.AI_BOARD_NUM+parseInt(board)+1;
	}
}

function fillTables(){
	var param={};
	param.board=getSelBoard();
	var boardname='';
	
	if( param.board <= CONST.AI_BOARD_NUM){
		boardname=$.i18n.prop('board_ai')+'#'+param.board;
	}else{
		boardname=$.i18n.prop('board_di')+'#'+ (parseInt(param.board) - CONST.AI_BOARD_NUM -1);
	}
	$('#board_name').html(boardname);
	var dataParam = {
		    url: rootPath + "/devparam/channelctrl/query",
			param:param,
			call: function(data) {
				if(data!=null && data.channels!=null) {
					var htmlTb1='';
					var htmlTb2='';
					var size = data.channels.length;
					for( var i in data.channels ){
						var chl = data.channels[i];
						var html='';
						 html += "<tr>";
						 html += "<td>"+ "<input type='checkbox' data-toggle='toggle'"+(chl.enable==true?'checked':'')+"/>" + "</td>";
						 html += "<td class='channelId' id='"+chl.kind+"'>"+ chl.id + "</td>";
						 html += "<td>"+ "<input class='channelName form-control' type='text' value='"+(validateVar(chl.name)?chl.name:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
						 html += "</tr>";
						 if( i < size/2 ){
							 htmlTb1 += html;
						 }else{
							 htmlTb2 += html;
						 }
					}
					$('#channelTb1 tbody').html(htmlTb1);
					$('#channelTb2 tbody').html(htmlTb2);
					
					$('#channelTb1 tbody :checkbox').bootstrapToggle({
						size:'mini'
					});
					$('#channelTb2 tbody :checkbox').bootstrapToggle({
						size:'mini'
					});
					$('#channelTb1 tbody :checkbox').change(function(){
						var ischecked = $(this).prop('checked');
						var tdparent=$(this).parent();
						while(true){
							if(tdparent.get(0).nodeName=='td' || tdparent.get(0).nodeName=='TD'){
								break;
							}
							tdparent = tdparent.parent();
						}
						
						var inputnode = tdparent.next().next().find('input');
						if( ischecked == true){
							inputnode.removeAttr('disabled');
						}else{
							inputnode.attr('disabled','disabled');
						}
					});
					$('#channelTb2 tbody :checkbox').change(function(){
						var ischecked = $(this).prop('checked');
						var tdparent=$(this).parent();
						while(true){
							if(tdparent.get(0).nodeName=='td' || tdparent.get(0).nodeName=='TD'){
								break;
							}
							tdparent = tdparent.parent();
						}
						
						var inputnode = tdparent.next().next().find('input');
						if( ischecked == true){
							inputnode.removeAttr('disabled');
						}else{
							inputnode.attr('disabled','disabled');
						}
					});
				}
			}
	};
	getAjaxData(dataParam,false);
}

function enableAll(){
	$('#channelTb1 tbody :checkbox').each(function(){
		$(this).bootstrapToggle('on');
	});
	$('#channelTb2 tbody :checkbox').each(function(){
		$(this).bootstrapToggle('on');
	});
}

function disableAll(){
	$('#channelTb1 tbody :checkbox').each(function(){
		$(this).bootstrapToggle('off');
	});
	$('#channelTb2 tbody :checkbox').each(function(){
		$(this).bootstrapToggle('off');
	});
}

function getItems(){
	var list = new Array();
	var index = 0;
	$('#channelTb1 tbody tr').each(function(){
		var p = {};
		p.enable=$(this).find(':checkbox').prop('checked');
		p.id=$(this).find('.channelId').text();
		p.name = $(this).find('.channelName').val();
		p.kind=$(this).find('.channelId').attr('id');
		list.push(p);
	});
	$('#channelTb2 tbody tr').each(function(){
		var p = {};
		p.enable=$(this).find(':checkbox').prop('checked');
		p.id=$(this).find('.channelId').text();
		p.name = $(this).find('.channelName').val();
		p.kind=$(this).find('.channelId').attr('id');
		list.push(p);
	});
	return list;
}

function update(){
	var list = getItems();
	var param={};
	param.items=JSON.stringify(list);
	var dataParam = {
		    url: rootPath + "/devparam/channelctrl/update",
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