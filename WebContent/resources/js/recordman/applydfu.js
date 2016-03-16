$(function(){
	setNavActive('nav_setup');
	
});

var timer;

function apply(){
	stopWaitAnim();
	showConfirm($.i18n.prop('dfuconf_apply'), $.i18n.prop('dfuconf_apply_confirm'), function(){
		var param={};
		var dataParam = {
			    url: rootPath + "/devparam/dfuapply/apply",
				param:param,
				call: function(data) {
					if(data!=null && data.result != null) {
						if( data.result ){
							startWaitAnim();
							setTimeout("queryTaskResult(" + data.RRI + ","+doResult+ ")",
									parseInt(CONST.COMMU.QUERYINTERVAL));
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

function doResult(result, data){
	showAlert($.i18n.prop('oper_success'), $.i18n.prop('dfuconf_apply_success'));
}
