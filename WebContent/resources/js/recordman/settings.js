$(function(){
	setNavActive('nav_dfu');
	
	$('#stm_save').click(function(){
		var param={};
		param.oldId = $('#stm_stgroup_oldname').val();
		param.newId = $('#stm_stgroup_name').val();
		var dataParam = {
			    url: rootPath + "/devparam/settings/editstgroup",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillStgroupList();
							$("#editStgroupModal").modal('hide');
							$('#stgroups').val(param.newId);
							fillSettingList();
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
	
	$('#stgroups').change(function(){
		saveActiveStgroup($('#stgroups').val());
		fillSettingList();
	});
	
	$('#sm_save').click(function(){
		var param={};
		param.group=$('#sm_set_group').val();
		param.sid=$('#sm_set_id').val();
		param.name=$('#sm_set_name').val();
		param.type=$('#sm_set_type').val();
		param.val=$('#sm_set_val').val();
		param.unit=$('#sm_set_unit').val();
		param.max=$('#sm_set_max').val();
		param.min=$('#sm_set_min').val();
		param.step=$('#sm_set_step').val();
		param.rate1=$('#sm_set_rate1').val();
		param.unit1=$('#sm_set_unit1').val();
		param.rate2=$('#sm_set_rate2').val();
		param.unit2=$('#sm_set_unit2').val();
		var dataParam = {
			    url: rootPath + "/devparam/settings/editsetting",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillStgroupList();
							$("#editSettingModal").modal('hide');
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
	
	fillStgroupList();
});

function saveActiveStgroup(index){
	setCookie('stgroupIndex', index);
}

function clearSettings(){
	$('.settings .list-group').html('');
}

function fillStgroupList(){
	var param={};
	var dataParam = {
		    url: rootPath + "/devparam/settings/stgroups",
			param:param,
			call: function(data) {
				if(data!=null && data.stgroups != null) {
					var html = '';
					html += "<option value=''>"+$.i18n.prop('all')+"</option>";
					var acStgroup = getCookie('stgroupIndex');
					var activeItem = '';
					for(var i=0; i < data.stgroups.length; i++){
						var m = data.stgroups[i];						
						if( acStgroup != '' && m == acStgroup){
							activeItem = m;
						}						
						html += "<option value='"+m+"'>"+m+"</option>";
					}
					$('#stgroups').html(html);
					$('#stgroups').val(activeItem);
					
					saveActiveStgroup(activeItem);
					
					fillSettingList();
					
				}
			}
	};
	getAjaxData(dataParam,false);
}

function fillSettingList(){
	var param={};	
	param.group=$('#stgroups').val();
	var dataParam = {
		    url: rootPath + "/devparam/settings/settings",
			param:param,
			call: function(data) {
				if(data!=null && data.settings != null) {
					var html = '';
					for(var i=0; i < data.settings.length; i++){
						var s = data.settings[i];						
						html += "<tr>"						
						html += "<td>"+s.group+"</td>";
						html += "<td>"+s.name+"</td>";
						html += "<td>"+(vaildateVar(s.unit)?s.unit:"")+"</td>";
						html += "<td>"+s.type+"</td>";
						html += "<td>"+s.val+"</td>";
						html += "<td>"+(vaildateVar(s.max)?s.max:"")+"</td>";
						html += "<td>"+(vaildateVar(s.min)?s.min:"")+"</td>";
						html += "<td>"+(vaildateVar(s.step)?s.step:"")+"</td>";
						html += "<td>"+(vaildateVar(s.rate1)?s.rate1:"")+"</td>";
						html += "<td>"+(vaildateVar(s.unit1)?s.unit1:"")+"</td>";
						html += "<td>"+(vaildateVar(s.rate2)?s.rate2:"")+"</td>";
						html += "<td>"+(vaildateVar(s.unit2)?s.unit2:"")+"</td>";
						html += "<td><button class='customBtn editBtn' onclick=\"editSetting('"+s.group+"','"+s.sid+"')\" title='"+$.i18n.prop('edit')+"'>";
						html += "</button><button class='customBtn deleteBtn' onclick=\"deleteSetting('"+s.group+"','"+s.sid+"')\" title='"+$.i18n.prop('delete')+"'></button></td>";
						html += "</tr>"
					}
					$('#settings tbody').html(html);
				}
			}
	};
	getAjaxData(dataParam,false);
}

function createStgroup(){
	$('#stm_stgroup_oldname').val('');
	$('#stm_stgroup_name').val('');
	$("#editStgroupModal").modal('show');
}

function editStgroup(){
	var id = $('#stgroups').val();
	if( id=='' )
		return;
	$('#stm_stgroup_oldname').val(id);
	$('#stm_stgroup_name').val(id);
	$("#editStgroupModal").modal('show');
}

function deleteStgroup()
{
	var id = $('#stgroups').val();
	if( id=='' )
		return;
	showConfirm($.i18n.prop('operate_confirm'),$.i18n.prop('stgroup_delete_confirm'), function(){
		var param={};	
		param.id=id;
		var dataParam = {
			    url: rootPath + "/devparam/settings/deletestgroup",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillStgroupList();
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

function editSetting(group, sid){
	var param={};	
	param.group=group;
	param.sid=sid;
	var dataParam = {
		    url: rootPath + "/devparam/settings/getsetting",
			param:param,
			call: function(data) {
				if(data!=null && data.setting != null) {
					var s = data.setting;
					var html = '';							
						html += "<option value='"+s.group+"'>"+s.group+"</option>";
					$('#sm_set_group').html(html);
					
					$('#sm_set_group').val(s.group);
					$('#sm_set_group').attr('disabled','');
					$('#sm_set_id').val(s.sid);
					$('#sm_set_id').attr('disabled','');
					$('#sm_set_name').val(s.name);
					$('#sm_set_type').val(s.type);
					$('#sm_set_val').val(s.val);
					$('#sm_set_unit').val(s.unit);
					$('#sm_set_max').val((vaildateVar(s.max)?s.max:""));
					$('#sm_set_min').val((vaildateVar(s.min)?s.min:""));
					$('#sm_set_step').val((vaildateVar(s.step)?s.step:""));
					$('#sm_set_rate1').val((vaildateVar(s.rate1)?s.rate1:""));
					$('#sm_set_unit1').val((vaildateVar(s.unit1)?s.unit1:""));
					$('#sm_set_rate2').val((vaildateVar(s.rate2)?s.rate2:""));
					$('#sm_set_unit2').val((vaildateVar(s.unit2)?s.unit2:""));
					$("#editSettingModal").modal('show');					
				}
			}
	};
	getAjaxData(dataParam,false);
}

function deleteSetting(group, sid)
{
	showConfirm($.i18n.prop('operate_confirm'),$.i18n.prop('setting_delete_confirm'), function(){
		var param={};	
		param.group=group;
		param.sid=sid;
		var dataParam = {
			    url: rootPath + "/devparam/settings/deletesetting",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillSettingList();
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

function createSetting(){
	var param={};
	var dataParam = {
		    url: rootPath + "/devparam/settings/stgroups",
			param:param,
			call: function(data) {
				if(data!=null && data.stgroups != null) {
					var html = '';
					for(var i=0; i < data.stgroups.length; i++){
						var m = data.stgroups[i];									
						html += "<option value='"+m+"'>"+m+"</option>";
					}
					$('#sm_set_group').html(html);
					$('#sm_set_group').val($('#stgroups').val());
					
					$('#sm_set_group').removeAttr('disabled');
					$('#sm_set_id').val('');
					$('#sm_set_id').removeAttr('disabled');
					$('#sm_set_name').val('');
					$('#sm_set_type').val('');
					$('#sm_set_val').val('');
					$('#sm_set_unit').val('');
					$('#sm_set_max').val('');
					$('#sm_set_min').val('');
					$('#sm_set_step').val('');
					$('#sm_set_rate1').val('');
					$('#sm_set_unit1').val('');
					$('#sm_set_rate2').val('');
					$('#sm_set_unit2').val('');
					$("#editSettingModal").modal('show');
				}
			}
	};
	getAjaxData(dataParam,false);			
}
