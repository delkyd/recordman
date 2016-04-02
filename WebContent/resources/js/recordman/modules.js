$(function(){
	setNavActive('nav_dfu');
	$('#module_kind').change(function(){
		clearAll();
		fillModuleList();
	});
	fillModuleList();
	$('.configs .list-group').children().click(function(event){
		changeactive($('.configs .list-group'), event);
	});
	$('.params .list-group').children().click(function(event){
		changeactive($('.params .list-group'), event);
	});
	
	$('#mm_save').click(function(){
		var param={};
		param.id = $('#mm_module_id').val();
		param.name = $('#mm_module_name').val();
		param.kind = $('#mm_module_kind').val();
		var dataParam = {
			    url: rootPath + "/mgrparam/modules/editmoduleattr",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillModuleList();
							$("#editModuleModal").modal('hide');
							activeModule(param.id);
							clearModuleItems();
							fillModuleItms();
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
	
	$('#mm_config_save').click(function(){
		var param={};
		param.id=$('#mm_config_id').val();
		param.name=$('#mm_config_name').val();
		param.kind=$('#mm_config_kind').val();
		param.valType=$('#mm_config_valtype').val();
		param.val=$('#mm_config_val').val();
		param.type='Configs';
		param.moduleId=getActiveModule();
		var dataParam = {
			    url: rootPath + "/mgrparam/modules/editmoduleitem",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillModuleItms();
							$("#editModuleConfigModal").modal('hide');
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
	
	$('#mm_param_save').click(function(){
		var param={};
		param.id=$('#mm_param_id').val();
		param.name=$('#mm_param_name').val();
		param.kind=$('#mm_param_kind').val();
		param.valType=$('#mm_param_valtype').val();
		param.val=$('#mm_param_val').val();
		param.type='Params';
		param.moduleId=getActiveModule();
		var dataParam = {
			    url: rootPath + "/mgrparam/modules/editmoduleitem",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							showAlert($.i18n.prop('oper_success'), $.i18n.prop(data.reason));
							fillModuleItms();
							$("#editModuleParamModal").modal('hide');
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

function saveActiveModule(index){
	setCookie('moduleIndex', index);
}

function saveActiveModuleConfig(index){
	setCookie('moduleConfigIndex', index);
}

function saveActiveModuleParam(index){
	setCookie('moduleParamIndex', index);
}

function changeactive(listgroup, event){
	listgroup.children().removeClass('active');
	
	var item = event.target;
	if( false == $(item).hasClass('list-group-item') ){
		item = $(item).parent();
	}
	$(item).addClass('active');
}

function activeModule(id){
	$('.modulelist .list-group').children().removeClass('active');
	$('.modulelist .list-group-item[id='+id+']').addClass('active');
	saveActiveModule(id);
}

function clearAll(){
	clearModuleList();
	clearModuleItems();
}

function clearModuleList(){
	$('.modulelist .list-group').html("");
}

function clearModuleItems(){
	$('.configs .list-group').html('');
	$('.params .list-group').html('');
}

function getActiveModule(){
	var id = $('.modulelist .list-group .active').attr('id');
	return id;
}

function getActiveModuleConfig(){
	var id = $('.configs .list-group .active').attr('id');
	return id;
}

function getActiveModuleParam(){
	var id = $('.params .list-group .active').attr('id');
	return id;
}
function fillModuleList(){
	var param={};
	param.kind = $('#module_kind').val();
	var dataParam = {
		    url: rootPath + "/mgrparam/modules/modulelist",
			param:param,
			call: function(data) {
				if(data!=null && data.modulelist != null) {
					var html = '';
					var acModule = getCookie('moduleIndex');
					var activeItem = '';
					for(var i=0; i < data.modulelist.length; i++){
						var m = data.modulelist[i];
						if( 0 == i ){
							activeItem = m.id;
						}
						if( acModule != '' && m.id == acModule){
							activeItem = m.id;
						}						
						html += "<a id='"+m.id+"' class='list-group-item'>";
						html += "<span class='list-group-item-text'>"+m.name+"</span>";
						if( m.kind == 'RecLine' ){
							html += "<button class='customBtn craetelineBtn' title='"+$.i18n.prop('createline')+"' onclick='findLine(\""+m.id+"\",\""+m.name+"\",event)'></button>";
						}
						html += "<button class='customBtn relateBtn' title='"+$.i18n.prop('relate')+"' onclick='findGroup(\""+m.id+"\",\""+m.name+"\",event)'></button>";
						html += "<button class='customBtn deleteBtn' title='"+$.i18n.prop('delete')+"'></button>";
						html += "<button class='customBtn editBtn' title='"+$.i18n.prop('edit')+"'></button></a>";
					}
					$('.modulelist .list-group').html(html);
					if( activeItem != '' ){
						activeModule(activeItem);
					}
					$('.modulelist .list-group').children().click(function(event){
						changeactive($('.modulelist .list-group'), event);
						saveActiveModule(getActiveModule());
						clearModuleItems();
						fillModuleItems();
					});
					$('.modulelist .list-group .deleteBtn').click(function(){
						var id = getActiveModule();
						showConfirm($.i18n.prop('operate_confirm'),$.i18n.prop('module_delete_confirm'), function(){
							deleteModule(id);
							fillModuleList();
						});
						return false;
					});
					$('.modulelist .list-group .editBtn').click(function(){
						var param={};
						param.id = getActiveModule();
						var dataParam = {
							    url: rootPath + "/mgrparam/modules/moduleattr",
								param:param,
								call: function(data) {
									if(data!=null && data.module != null) {
										var m = data.module;
										$('#mm_module_id').val(m.id);
										$('#mm_module_id').attr('disabled','');
										$('#mm_module_name').val(m.name);
										$('#mm_module_kind').val(m.kind);
										$("#editModuleModal").modal('show');
									}
								}
						};
						getAjaxData(dataParam,false);
						return false;
					});
					
					if( data.modulelist.length > 0 ){
						fillModuleItems();
					}
				}
			}
	};
	getAjaxData(dataParam,false);
}

function createModule(){
	$('#mm_module_id').val('');
	$('#mm_module_id').removeAttr('disabled');
	$('#mm_module_name').val('');
	$('#mm_module_kind').val($('#module_kind').val());
	$("#editModuleModal").modal('show');
}

function fillModuleItems(){
	var param={};
	param.id = getActiveModule();
	var dataParam = {
		    url: rootPath + "/mgrparam/modules/moduleitems",
			param:param,
			call: function(data) {
				if(data!=null && data.moduleitems != null) {
					if( data.moduleitems.configs != null ){
						var html = '';
						var acConfig = getCookie('moduleConfigIndex');
						for(var i=0; i < data.moduleitems.configs.length; i++){
							var m = data.moduleitems.configs[i];
							if( acConfig == m.id ){
								html += "<a id='"+m.id+"' class='list-group-item active'>";
							}else{
								html += "<a id='"+m.id+"' class='list-group-item'>";
							}
														
							html += "<h5 class='list-group-item-heading'>"+m.name+"</h5>";
							html += "<span class='list-group-item-text'>["+m.kind+"]</span>";
							html += "<span class='list-group-item-text'>["+m.valType+"]</span>";
							html += "<span class='list-group-item-text'>["+m.val+"]</span>";
							html += "<button class='customBtn deleteBtn' title='"+$.i18n.prop('delete')+"'></button>";
							html += "<button class='customBtn editBtn' title='"+$.i18n.prop('edit')+"'></button></a>";
						}
						$('.configs .list-group').html(html);
						$('.configs .list-group').children().click(function(event){
							changeactive($('.configs .list-group'), event);
							saveActiveModuleConfig(getActiveModuleConfig());
						});
						$('.configs .list-group .deleteBtn').click(function(){
							var id = getActiveModuleConfig();
							showConfirm($.i18n.prop('operate_confirm'),$.i18n.prop('moduleconfig_delete_confirm'), function(){
								deleteModuleItem(id);
								fillModuleItems();
							});
							return false;
						});
						$('.configs .list-group .editBtn').click(function(){
							var param={};
							param.moduleId = getActiveModule();
							param.id = getActiveModuleConfig();
							var dataParam = {
								    url: rootPath + "/devparam/modules/moduleitem",
									param:param,
									call: function(data) {
										if(data!=null && data.moduleItem != null) {
											var m = data.moduleItem;
											$('#mm_config_id').val(m.id);
											$('#mm_config_id').attr('disabled','');
											$('#mm_config_name').val(m.name);
											$('#mm_config_kind').val(m.kind);
											$('#mm_config_valtype').val(m.valType);
											$('#mm_config_val').val(m.val);
											$("#editModuleConfigModal").modal('show');
										}
									}
							};
							getAjaxData(dataParam,false);
							return false;
						});
					}
					if( data.moduleitems.params != null ){
						var html = '';
						var acParam = getCookie('moduleParamIndex');
						for(var i=0; i < data.moduleitems.params.length; i++){
							var m = data.moduleitems.params[i];
							if( acParam == m.id ){
								html += "<a id='"+m.id+"' class='list-group-item active'>";
							}else{
								html += "<a id='"+m.id+"' class='list-group-item'>";
							}
							
							html += "<h5 class='list-group-item-heading'>"+m.name+"</h5>";
							html += "<span class='list-group-item-text'>["+m.kind+"]</span>";
							html += "<span class='list-group-item-text'>["+m.valType+"]</span>";
							html += "<span class='list-group-item-text'>["+m.val+"]</span>";
							html += "<button class='customBtn deleteBtn' title='"+$.i18n.prop('delete')+"'></button>";
							html += "<button class='customBtn editBtn' title='"+$.i18n.prop('edit')+"'></button></a>";
						}
						$('.params .list-group').html(html);
						$('.params .list-group').children().click(function(event){
							changeactive($('.params .list-group'), event);
							saveActiveModuleParam(getActiveModuleParam());
						});
						$('.params .list-group .deleteBtn').click(function(){
							var id = getActiveModuleParam();
							showConfirm($.i18n.prop('operate_confirm'),$.i18n.prop('moduleparam_delete_confirm'), function(){
								deleteModuleItem(id);
								fillModuleItems();
							});
							return false;
						});
						
						$('.params .list-group .editBtn').click(function(){
							var param={};
							param.moduleId = getActiveModule();
							param.id = getActiveModuleParam();
							var dataParam = {
								    url: rootPath + "/mgrparam/modules/moduleitem",
									param:param,
									call: function(data) {
										if(data!=null && data.moduleItem != null) {
											var m = data.moduleItem;
											$('#mm_param_id').val(m.id);
											$('#mm_param_id').attr('disabled','');
											$('#mm_param_name').val(m.name);
											$('#mm_param_kind').val(m.kind);
											$('#mm_param_valtype').val(m.valType);
											$('#mm_param_val').val(m.val);
											$("#editModuleParamModal").modal('show');
										}
									}
							};
							getAjaxData(dataParam,false);
							return false;
						});
					}
					
				}
			}
	};
	getAjaxData(dataParam,false);
}

function deleteModule(id){
	var param={};
	param.id=id;
	var dataParam = {
		    url: rootPath + "/mgrparam/modules/deletemodule",
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

function deleteModuleItem(id){
	var param={};
	param.id=id;
	var dataParam = {
		    url: rootPath + "/mgrparam/modules/deletemoduleitem",
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

function createModuleConfig(){
	$('#mm_config_id').val('');
	$('#mm_config_id').removeAttr('disabled');
	$('#mm_config_name').val('');
	$('#mm_config_kind').val('');
	$('#mm_config_valtype').val('');
	$('#mm_config_val').val('');
	$("#editModuleConfigModal").modal('show');
}

function createModuleParam(){
	$('#mm_param_id').val('');
	$('#mm_param_id').removeAttr('disabled');
	$('#mm_param_name').val('');
	$('#mm_param_kind').val('');
	$('#mm_param_valtype').val('');
	$('#mm_param_val').val('');
	$("#editModuleParamModal").modal('show');
}

function findGroup(moduleId, moduleName, e){
	var param={};
	param.group=moduleName;
	var dataParam = {
		    url: rootPath + "/mgrparam/settings/findgroup",
			param:param,
			call: function(data) {
				if(data!=null && data.result != null) {
					if( data.result ){
						showConfirm($.i18n.prop('create_settings'), $.i18n.prop('stgroup_exist'), function(){createSettings(moduleId);}, null);
					}else{
						showConfirm($.i18n.prop('create_settings'), $.i18n.prop('stgroup_no_exist'), function(){createSettings(moduleId);}, null);
					}					
				}else{
					showAlert($.i18n.prop('oper_fail'), $.i18n.prop('exceptionerror'));
				}
			}
	};
	getAjaxData(dataParam,false);
	e.stopPropagation();
}

function createSettings(moduleId){
	var param={};
	param.id=moduleId;
	var dataParam = {
		    url: rootPath + "/mgrparam/modules/craetesettings",
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

function findLine(moduleId, moduleName, e){
	var param={};
	param.id=moduleName;
	var dataParam = {
		    url: rootPath + "/mgrparam/line/findline",
			param:param,
			call: function(data) {
				if(data!=null && data.result != null) {
					if( data.result ){
						showConfirm($.i18n.prop('create_line'), $.i18n.prop('line_exist'), function(){createLine(moduleId);}, null);
					}else{
						showConfirm($.i18n.prop('create_line'), $.i18n.prop('line_no_exist'), function(){createLine(moduleId);}, null);
					}					
				}else{
					showAlert($.i18n.prop('oper_fail'), $.i18n.prop('exceptionerror'));
				}
			}
	};
	getAjaxData(dataParam,false);
	e.stopPropagation();
}

function createLine(moduleId){
	var param={};
	param.id=moduleId;
	var dataParam = {
		    url: rootPath + "/mgrparam/modules/craeteline",
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