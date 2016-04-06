$(function(){
	setNavActive('nav_mgrconf');
});

function update(){
	var param={};
	param.fileconf={};
	param.fileconf.fault_path=$('#fault_savepath').val();
	param.fileconf.fault_days=$('#fault_savedays').val();
	param.fileconf.continue_path=$('#contin_savepath').val();
	param.fileconf.continue_days=$('#contin_savedays').val();
	param.logconf={};
	param.logconf.path=$('#log_path').val();
	param.logconf.level=$('#log_level').val();
	param.logconf.days=$('#log_days').val();
	var dataParam = {
		    url: rootPath + "/mgrparam/mgrconfig/update",
			param:param,
			call: function(data) {
				if(data!=null && data.result != null) {
					if( data.result ){
						var changes = new Array('record_file_config', 'system_log_config');
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
		showAlert($.i18n.prop('oper_fail'), $.i18n.prop('mgrconf_apply_fail'));
	}else if( data.result == 1 ){
		showAlert($.i18n.prop('oper_success'), $.i18n.prop('mgrconf_apply_success'));
	}
}