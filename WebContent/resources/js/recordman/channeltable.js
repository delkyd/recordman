$(function(){
	setNavActive('nav_channels');
	
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

function getTerminal(data, chlId){
	if( data!= null && data.terminals!=null ){
		return data.terminals[chlId];
	}
}

function fillAITable(data){
	var headhtml="<tr>";
	headhtml += "<th>"+$.i18n.prop('isEnable')+"</th>";
	headhtml += "<th>"+$.i18n.prop('terminal_id')+"</th>";
	headhtml += "<th>"+$.i18n.prop('terminal_type')+"</th>";
	headhtml += "<th>"+$.i18n.prop('terminal_Rate')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_name')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_unit')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_rate1')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_unit1')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_rate2')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_unit2')+"</th>";
	headhtml += "</tr>";
	$('#channelTb thead').html(headhtml);
	if(data!=null && data.channels!=null) {
		var html='';
		var size = data.channels.length;
			for( var i in data.channels ){
				var chl = data.channels[i];
				var t = getTerminal(data, chl.id);
				 html += "<tr>";
				 html += "<td>"+ "<input type='checkbox' data-toggle='toggle'"+(chl.enable==true?'checked':'')+"/>" + "</td>";
				 html += "<td class='channelId' id='"+chl.kind+"'>"+ chl.id + "</td>";
				 html += "<td><select class='data_terminalKind form-control' "+(chl.enable==false?'disabled':'')+
				 "><option value='AMP' "+(t.kind==='AMP'?'selected':'')+">"+$.i18n.prop('terminal_type_ai_amp')+"</option>"+
				 "<option value='VOL' "+(t.kind==='VOL'?'selected':'')+">"+$.i18n.prop('terminal_type_ai_vol')+"</option>"+
				 "<option value='DC' "+(t.kind==='DC'?'selected':'')+">"+$.i18n.prop('terminal_type_ai_dc')+"</option>"
				 +"</select></td>";
				 html += "<td>"+ "<input class='data_terminalRate form-control' type='text' value='"+(validateVar(t.rate)?t.rate:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>"; 
				 html += "<td>"+ "<input class='data_channelName form-control' type='text' value='"+(validateVar(chl.name)?chl.name:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
				 html += "<td>"+ "<input class='data_channelUnit form-control' type='text' value='"+(validateVar(chl.unit)?chl.unit:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
				 html += "<td>"+ "<input class='data_channelRate1 form-control' type='text' value='"+(validateVar(chl.rate1)?chl.rate1:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
				 html += "<td>"+ "<input class='data_channelUnit1 form-control' type='text' value='"+(validateVar(chl.unit1)?chl.unit1:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
				 html += "<td>"+ "<input class='data_channelRate2 form-control' type='text' value='"+(validateVar(chl.rate2)?chl.rate2:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
				 html += "<td>"+ "<input class='data_channelUnit2 form-control' type='text' value='"+(validateVar(chl.unit2)?chl.unit2:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
				 html += "</tr>";
			}
			$('#channelTb tbody').html(html);
		}
}

function fillDITable(data){
	var headhtml="<tr>";
	headhtml += "<th>"+$.i18n.prop('isEnable')+"</th>";
	headhtml += "<th>"+$.i18n.prop('terminal_id')+"</th>";
	headhtml += "<th>"+$.i18n.prop('terminal_type')+"</th>";
	headhtml += "<th>"+$.i18n.prop('terminal_debounce')+"</th>";
	headhtml += "<th>"+$.i18n.prop('terminal_reverse')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_name')+"</th>";
	headhtml += "<th>"+$.i18n.prop('channel_val')+"</th>";
	headhtml += "</tr>";
	$('#channelTb thead').html(headhtml);
	if(data!=null && data.channels!=null) {
		var html='';
		var size = data.channels.length;		
			for( var i in data.channels ){
				var chl = data.channels[i];
				var t = getTerminal(data, chl.id);
				 html += "<tr>";
				 html += "<td>"+ "<input type='checkbox' data-toggle='toggle'"+(chl.enable==true?'checked':'')+"/>" + "</td>";
				 html += "<td class='channelId' id='"+chl.kind+"'>"+ chl.id + "</td>";
				 if( CONST.TERMINAL_KIND.BI === chl.kind){
					 html += "<td><select class='data_terminalKind form-control' "+(chl.enable==false?'disabled':'')+
					 "><option>"+$.i18n.prop('terminal_type_bi')+"</option>"+"</select></td>";
					 html += "<td>"+ "<input class='data_terminalDebounce form-control' type='text' value='"+(validateVar(t.debounce)?t.debounce:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>"; 
					 html += "<td><select class='data_terminalReverse form-control' "+(chl.enable==false?'disabled':'')+
					 "><option value='0' "+(t.reverse==='0'?'selected':'')+">"+$.i18n.prop('no')+"</option>"+
					 +"<option value='1' "+(t.reverse==='1'?'selected':'')+">"+$.i18n.prop('yes')+"</select></td>";
					 html += "<td>"+ "<input class='data_channelName form-control' type='text' value='"+(validateVar(chl.name)?chl.name:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
					 html += "<td>"+ "<input class='data_channelVal form-control' type='text' value='"+(validateVar(chl.val)?chl.val:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";	
				 }else if( CONST.TERMINAL_KIND.BO === chl.kind ){
					 html += "<td><select class='data_terminalKind form-control' "+(chl.enable==false?'disabled':'')+
					 "><option>"+$.i18n.prop('terminal_type_bo')+"</option>"+"</select></td>";
					 html += "<td> </td>";
					 html += "<td> </td>";
					 html += "<td>"+ "<input class='data_channelName form-control' type='text' value='"+(validateVar(chl.name)?chl.name:'') + "' "+(chl.enable==false?'disabled':'')+"/></td>";
				 }
				 
				 html += "</tr>";
			}
			$('#channelTb tbody').html(html);
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
		    url: rootPath + "/mgrparam/channeltable/query",
			param:param,
			call: function(data) {
				var boardtype = getSelType();
				if( boardtype === CONST.CHANNEL_TYPE.AI){
					fillAITable(data);
				}else if( boardtype === CONST.CHANNEL_TYPE.DI){
					fillDITable(data);
				}

					$('#channelTb tbody :checkbox').bootstrapToggle({
						size:'mini'
					});
					$('#channelTb tbody :checkbox').change(function(){
						var ischecked = $(this).prop('checked');
						var tdparent=$(this).parent();
						while(true){
							if(tdparent.get(0).nodeName=='td' || tdparent.get(0).nodeName=='TD'){
								break;
							}
							tdparent = tdparent.parent();
						}
						
						var nextnode = tdparent.next();
						while( nextnode != null && nextnode.length > 0){
							var node = nextnode.find('input');
							if( node != null && node.length > 0 ){
								if( ischecked == true){
									node.removeAttr('disabled');
								}else{
									node.attr('disabled','disabled');
								}
							}
							
							node = nextnode.find('select');
							if( node != null && node.length > 0 ){
								if( ischecked == true){
									node.removeAttr('disabled');
								}else{
									node.attr('disabled','disabled');
								}
							}
							nextnode = nextnode.next();
						}
					});
			}
	};
	getAjaxData(dataParam,false);
}

function enableAll(){
	$('#channelTb tbody :checkbox').each(function(){
		$(this).bootstrapToggle('on');
	});
}

function disableAll(){
	$('#channelTb tbody :checkbox').each(function(){
		$(this).bootstrapToggle('off');
	});
}

function getItems(){
	var list = new Array();
	var index = 0;
	$('#channelTb tbody tr').each(function(){
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