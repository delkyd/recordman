$(function(){
	setNavActive('nav_line');
	
	$('#line').change(function(){
		saveActiveLine($('#line').val());
		fillLineparam();
	});
	
	$('#lm_save').click(function(){
		var param={};
		param.oldId = $('#lm_line_oldname').val();
		param.newId = $('#lm_line_name').val();
		var dataParam = {
			    url: rootPath + "/devparam/line/editline",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillLineList();
							$("#editLineModal").modal('hide');
							$('#line').val(param.newId);
							fillLineparam();
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
	
	fillLineList();
});


function saveActiveLine(index){
	setCookie('lineIndex', index);
}

function fillLineList(){
	var param={};
	var dataParam = {
		    url: rootPath + "/devparam/line/lines",
			param:param,
			call: function(data) {
				if(data!=null && data.lines != null) {
					var html = '';
					var acLine = getCookie('lineIndex');
					var activeItem = '';
					for(var i=0; i < data.lines.length; i++){
						var m = data.lines[i];
						if( 0 == i ){
							activeItem = m;
						}
						if( acLine != '' && m == acLine){
							activeItem = m;
						}						
						html += "<option value='"+m+"'>"+m+"</option>";
					}
					$('#line').html(html);
					$('#line').val(activeItem);
					
					saveActiveLine(activeItem);
					
					fillLineparam();
					
				}
			}
	};
	getAjaxData(dataParam,false);
}

function clearLineparam(){
	$('#line_length').val('');
	$('#line_ratedcurrent').val('');
	$('#line_ratedvoltage').val('');
	$('#line_r0').val('');
	$('#line_r1').val('');
	$('#line_r2').val('');
	$('#line_x0').val('');
	$('#line_x1').val('');
	$('#line_x2').val('');
	$('#line_ia').val('');
	$('#line_ib').val('');
	$('#line_ic').val('');
	$('#line_i0').val('');
	$('#line_ua').val('');
	$('#line_ub').val('');
	$('#line_uc').val('');
	$('#line_u0').val('');
}

function fillLineparam(){
	clearLineparam();
	var param={};
	param.id= $('#line').val();
	var dataParam = {
		    url: rootPath + "/devparam/line/lineparam",
			param:param,
			call: function(data) {
				if(data!=null) {
					$('#line_length').val(data.length);
					$('#line_ratedcurrent').val(data.ratedcurrent);
					$('#line_ratedvoltage').val(data.ratedvoltage);
					$('#line_r0').val(data.r0);
					$('#line_r1').val(data.r1);
					$('#line_r2').val(data.r2);
					$('#line_x0').val(data.x0);
					$('#line_x1').val(data.x1);
					$('#line_x2').val(data.x2);
					$('#line_ia').val(data.ia);
					$('#line_ib').val(data.ib);
					$('#line_ic').val(data.ic);
					$('#line_i0').val(data.i0);
					$('#line_ua').val(data.ua);
					$('#line_ub').val(data.ub);
					$('#line_uc').val(data.uc);
					$('#line_u0').val(data.u0);
				}
			}
	};
	getAjaxData(dataParam,false);
}

function update(){
	var param={};
	param.name=$('#line').val();
	param.length=$('#line_length').val();
	param.ratedcurrent=$('#line_ratedcurrent').val();
	param.ratedvoltage=$('#line_ratedvoltage').val();
	param.r0=$('#line_r0').val();
	param.r1=$('#line_r1').val();
	param.r2=$('#line_r2').val();
	param.x0=$('#line_x0').val();
	param.x1=$('#line_x1').val();
	param.x2=$('#line_x2').val();
	param.ia=$('#line_ia').val();
	param.ib=$('#line_ib').val();
	param.ic=$('#line_ic').val();
	param.i0=$('#line_i0').val();
	param.ua=$('#line_ua').val();
	param.ub=$('#line_ub').val();
	param.uc=$('#line_uc').val();
	param.u0=$('#line_u0').val();
	var dataParam = {
		    url: rootPath + "/devparam/line/editlineparam",
			param:param,
			call: function(data) {
				if(data!=null && data.result != null) {
					if( data.result ){
						var changes = new Array('line_param');
						applymgr(changes, doResult);
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
		showAlert($.i18n.prop('oper_fail'), $.i18n.prop('mgrline_apply_fail'));
	}else if( data.result == 1 ){
		showAlert($.i18n.prop('oper_success'), $.i18n.prop('mgrline_apply_success'));
	}
}

function createLine(){
	$('#lm_line_oldname').val('');
	$('#lm_line_name').val('');
	$("#editLineModal").modal('show');
}

function editLine(){
	var id = $('#line').val();
	if( id=='' )
		return;
	$('#lm_line_oldname').val(id);
	$('#lm_line_name').val(id);
	$("#editLineModal").modal('show');
}

function deleteLine()
{
	var id = $('#line').val();
	if( id=='' )
		return;
	showConfirm($.i18n.prop('operate_confirm'),$.i18n.prop('line_delete_confirm'), function(){
		var param={};	
		param.id=id;
		var dataParam = {
			    url: rootPath + "/devparam/line/deleteline",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillLineList();
						}else{
							showAlert($.i18n.prop('oper_fail'), $.i18n.prop(data.reason));
						}					
					}else{
						showAlert($.i18n.prop('oper_fail'), $.i18n.prop('exceptionerror'));
					}
				}
		};
		getAjaxData(dataParam,false);
	});
}
