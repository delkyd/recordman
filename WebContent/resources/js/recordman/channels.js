$(function(){
	setNavActive('nav_setup');
	//fill(1,3);
	setSvgFunc();
});

function getElesLength(objs){
	   var len;
	     try{
	    	  //支持HTML5 中的处理
	    	 len=objs.getLength();
	      }catch(e){
	    	  //处理IE 浏览器底版本处理
	    	  len=objs.length;
	    }
	   
	    return len;
}

function fill(board, index){
	var param={};
	param.board=board;
	param.index=index;
	var dataParam = {
		    url: rootPath + "/devparam/channels/query",
			param:param,
			call: function(data) {
				if(data!=null) {
					if( data.terminal != null ){
						var t = data.terminal;
						$('#terminal_board').val(t.board);
						$('#terminal_index').val(t.index);
						$('#terminal_name').val(t.name);
						var kind = t.kind;
						customizeByKind(kind);
						$('#terminal_type').val(t.type);
						$('#terminal_rate').val(t.rate);
						$('#terminal_debounce').val(t.debounce);
						$('#terminal_reverse').val(t.reverse);
					}
					if( null != data.channel ){
						var c = data.channel;
						$('#channel_id').val(c.id);
						$('#channel_name').val(c.name);
						$('#channel_unit').val(c.unit);
						$('#channel_rate1').val(c.rate1);
						$('#channel_unit1').val(c.unit1);
						$('#channel_rate2').val(c.rate2);
						$('#channel_unit2').val(c.unit2);
						$('#channel_val').val(c.val);
					}
				}
			}
	};
	getAjaxData(dataParam,false);
}

function setSvgFunc(){
	var svgDoc = document.getElementById("svgEle").getSVGDocument();
	var terminalEles = svgDoc.getElementsByClassName('terminal_svg');
	var len = getElesLength(terminalEles);
	for( var i = 0; i<len; i++){
		var t = terminalEles.item(i);
		var tid = t.getAttribute("id");
		var bid = t.parentNode.getAttribute("id");
		
		t.setAttribute("onclick", "function a(){fill("+bid+","+tid+");}");
	}
}

function update(){
	var param={};
	param.terminal={};
	param.terminal.board=$('#terminal_board').val();
	param.terminal.index=$('#terminal_index').val();
	param.terminal.name=$('#terminal_name').val();
	var type = $('#terminal_type').val();
	param.terminal.type=type;
	var kind = 'AI';
	switch(type){
	case CONST.TERMINAL_KIND.BI:
		kind='BI';
		break;
	case CONST.TERMINAL_KIND.BO:
		kind = 'BO';
		break;
	}
	param.terminal.kind=kind;
	param.terminal.rate=$('#terminal_rate').val();
	param.terminal.debounce=$('#terminal_debounce').val();
	param.terminal.reverse=$('#terminal_reverse').val();
	
	param.channel={};
	param.channel.kind=kind;
	param.channel.id=$('#channel_id').val();
	param.channel.name=$('#channel_name').val();
	param.channel.unit=$('#channel_unit').val();
	param.channel.rate1=$('#channel_rate1').val();
	param.channel.unit1=$('#channel_unit1').val();
	param.channel.rate2=$('#channel_rate2').val();
	param.channel.unit2=$('#channel_unit2').val();
	param.channel.val=$('#channel_val').val();
	
	var dataParam = {
		    url: rootPath + "/devparam/channels/update",
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

function customizeByKind(kind){
	$('.channels .terminal-info').addClass(kind);
	$('.channels .channel-info').addClass(kind);
	var html='';
	switch(kind){
	case CONST.TERMINAL_KIND.AI:
		html += "<option value='AMP'>"+$.i18n.prop('terminal_type_ai_amp')+"</option>";
		html += "<option value='VOL'>"+$.i18n.prop('terminal_type_ai_vol')+"</option>";
		html += "<option value='DC'>"+$.i18n.prop('terminal_type_ai_dc')+"</option>";
		break;
	case CONST.TERMINAL_KIND.BI:
		html += "<option value='BI'>"+$.i18n.prop('terminal_type_bi')+"</option>";
		break;
	case CONST.TERMINAL_KIND.BO:
		html += "<option value='BO'>"+$.i18n.prop('terminal_type_bo')+"</option>";
		break;
	}
	$('#terminal_type').html(html);
}