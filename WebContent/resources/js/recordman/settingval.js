$(function(){
	setNavActive('nav_setup');

	$('#stgroups').change(function(){
		fillSettingList();
	});
	
	fillStgroupList();
});

function fillStgroupList(){
	var param={};
	var dataParam = {
		    url: rootPath + "/devparam/settings/stgroups",
			param:param,
			call: function(data) {
				if(data!=null && data.stgroups != null) {
					var html = '';
					html += "<option value=''>"+$.i18n.prop('all')+"</option>";
					
					for(var i=0; i < data.stgroups.length; i++){
						var m = data.stgroups[i];	
						html += "<option value='"+m+"'>"+m+"</option>";
					}
					$('#stgroups').html(html);
					
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
						html += "<td>"+(validateVar(s.unit)?s.unit:"")+"</td>";
						html += "<td>"+s.type+"</td>";
						html += "<td>"+"<input type='text' data-sid=\""+ s.sid +"\" data-group=\""+ s.group+"\" data-oldvalue=\""+
						s.val+"\" data-orivalue=\""+s.val+"\" class='settingvalue' value='"+s.val+"' onChange=checkValidate(event,\""+s.type+"\",\""
						+s.min+"\",\""+s.max+"\",\""+s.step+"\")></td>";
						html += "<td>"+(validateVar(s.max)?s.max:"")+"</td>";
						html += "<td>"+(validateVar(s.min)?s.min:"")+"</td>";
						html += "<td>"+(validateVar(s.step)?s.step:"")+"</td>";
						html += "<td>"+(validateVar(s.rate1)?s.rate1:"")+"</td>";
						html += "<td>"+(validateVar(s.unit1)?s.unit1:"")+"</td>";
						html += "<td>"+(validateVar(s.rate2)?s.rate2:"")+"</td>";
						html += "<td>"+(validateVar(s.unit2)?s.unit2:"")+"</td>";
						html += "</tr>"
					}
					$('#settings tbody').html(html);
				}
			}
	};
	getAjaxData(dataParam,false);
}

function checkValidate(event, type, min, max, step){
	var item = event.target;
	var val = $(item).val();
	var rs = validateVar(val);
	if(rs){
		rs = checkSettingValidate(val, type, min, max, step);
	}

	if( !rs ){
		var oldv = $(item).attr('data-oldvalue');
		$(item).val(oldv);
	}else{
		var oriv = $(item).attr('data-orivalue');
		if( oriv === val ){
			$(item).removeClass('valuechanged');
		}else{
			$(item).addClass('valuechanged');
			$(item).attr('data-oldvalue', val);
		}	
	}
}

function checkSettingValidate(val, type, min, max, step){
	var re = true;
	if( val === undefined || val === '' ){
		re = false;
	}else{
		//check type
		switch(type){
		case 'Int':
			re = checkInt(val);
			break;
		case 'Uint':
			re = checkUint(val);
			break;
		case 'Float':
			re = checkFloat(val);
			break;
		case 'Bool':
			re = checkBool(val);
			break;
		}
		
		if(!re){
			showAlert($.i18n.prop('oper_fail'), $.i18n.prop('setting_vaildata_type'));
		}
		
		if(re){
			//check min max
			switch(type){
			case 'Int':
			case 'Uint':
				{
				var v = parseInt(val);
				if(validateVar(min)){
					var minv = parseInt(min);
					if( v < minv ){
						re = false;
					}else{
						if(validateVar(max)){
							var maxv = parseInt(max);
							if( v> maxv ){
								re = false;
							}
						}
					}
				}				
				break;
				}
			case 'Float':
			{
				var v = parseFloat(val);
				if(validateVar(min)){
					var minv = parseFloat(min);
					if( v < minv ){
						re = false;
					}else{
						if(validateVar(max)){
							var maxv = parseFloat(max);
							if( v> maxv ){
								re = false;
							}
						}
					}
				}				
				break;
				}
			}
			
			if(!re){
				showAlert($.i18n.prop('oper_fail'), $.i18n.prop('setting_vaildata_minmax'));
			}
		}
		
				
		//check step
		if(re){
			//check min max
			switch(type){
			case 'Int':
			case 'Uint':
				{
				var v = parseInt(val);
				if(validateVar(step) && validateVar(min)){
					var stepv = parseInt(step);
					var minv = parseInt(min);
					if( (v-minv)%stepv != 0 ){
						re = false;
					}
				}				
				break;
				}
			case 'Float':
			{
				var v = parseFloat(val);
				if(validateVar(step) && validateVar(min)){
					var stepv = parseFloat(step);
					var minv = parseFloat(min);
					var dis = (v-minv)%stepv;
					if( ((v-minv) < stepv) || (dis > 0.0001) ){
						re = false;
					}
				}			
				break;
				}
			}
			if(!re){
				showAlert($.i18n.prop('oper_fail'), $.i18n.prop('setting_vaildata_step'));
			}
		}	
	}
	return re;
}

function update(){
	var list = getChanges();
	var param={};
	param.changes=JSON.stringify(list);
	var dataParam = {
		    url: rootPath + "/devparam/settingval/update",
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

function getChanges(){
	var list = new Array();
	var index = 0;
	$('#settings .valuechanged').each(function(){
		var p = {};
		p.sid=$(this).attr('data-sid');
		p.group = $(this).attr('data-group');
		p.val=$(this).val();
		list[index]=p;
		index++;
	});
	return list;
}

function doResult(result, data){
	if( data.result == 0 ){
		showAlert($.i18n.prop('oper_fail'), $.i18n.prop('dfuconf_apply_fail'));
	}else if( data.result == 1 ){
		$('#settings .valuechanged').each(function(){
			p.sid=$(this).removeClass('valuechanged');
		});
		showAlert($.i18n.prop('oper_success'), $.i18n.prop('dfuconf_apply_success'));
	}
}
