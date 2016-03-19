$(function(){
	setNavActive('nav_mgr');
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