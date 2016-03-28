$(function(){
	setNavActive('nav_setup');
});

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