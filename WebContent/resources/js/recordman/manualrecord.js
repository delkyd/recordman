$(function(){
	setNavActive('nav_manualrecord');
});

function triggerRecord(){
	stopWaitAnim();
	var param = {};
	var dataParam = {
		url : rootPath + "/public/manualrecord",
		param : param,
		call : function(data) {
			if (data != null && data.result != null) {
				if (data.result) {
					startWaitAnim();
					setTimeout("queryTaskResult(" + data.RRI + "," + resultFunc
							+ ")", parseInt(CONST.COMMU.QUERYINTERVAL));
				} else {
					showAlert($.i18n.prop('oper_fail'), $.i18n
							.prop(data.reason));
				}
			} else {
				showAlert($.i18n.prop('oper_fail'), $.i18n
						.prop('exceptionerror'));
			}
		}
	};
	getAjaxData(dataParam, false);
}

function doResult(result, data){
	if( data.result == 0 ){
		showAlert($.i18n.prop('oper_fail'), $.i18n.prop('manualrecord_fail'));
	}else if( data.result == 1 ){
		showAlert($.i18n.prop('oper_success'), $.i18n.prop('manualrecord_success'));
	}
}