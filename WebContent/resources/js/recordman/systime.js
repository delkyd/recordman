$(function(){
	setNavActive('nav_sys');
	$('.ip_input .item').keyup(onipitemkeyup);
	$('#datetimepicker1').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss',
		sideBySide: true,
		locale: $.i18n.prop('locale')
	});
	$('#datetimepicker1').data("DateTimePicker").date(new Date());
});

function updatetime(){
	stopWaitAnim();
	var param = {};
	param.second=$('#datetimepicker1').data("DateTimePicker").date().unix();
	param.nanosecond=0;
	param.time_zone=$('#timezone').val();
	var dataParam = {
		url : rootPath + "/public/applytime",
		param : param,
		call : function(data) {
			if (data != null && data.result != null) {
				if (data.result) {
					startWaitAnim();
					setTimeout("queryTaskResult(" + data.RRI + "," + doResult
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
		showAlert($.i18n.prop('oper_fail'), $.i18n.prop('systime_apply_fail'));
	}else if( data.result == 1 ){
		showAlert($.i18n.prop('oper_success'), $.i18n.prop('systime_apply_success'));
	}
}