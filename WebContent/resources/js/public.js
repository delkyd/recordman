/* const define*/
var CONST={};
CONST.RUNSTATUS={};
CONST.RUNSTATUS.QUIT=0;
CONST.RUNSTATUS.RUN = 1;

CONST.TIMESYNC={};
CONST.TIMESYNC.DESYNC= 0;
CONST.TIMESYNC.SYNC=1;

CONST.PERIOD={};
CONST.PERIOD.NONE=0;
CONST.PERIOD.DAY=1;
CONST.PERIOD.WEEK=2;
CONST.PERIOD.MONTH=3;
CONST.PERIOD.HALFYEAR=4;
CONST.PERIOD.YEAR=5;

/* const end */

/* global variable define*/

/* global variable end*/


$(function(){
	setContentMinHeight();
	$(window).resize(setContentMinHeight);
	loadProperties();
	 
	$('.js-slideout-toggle').click(function(){
		toggleSlidepanel();
	});
	
	$('.mobile-menu .dropdownmenu').click(function(){
		$(this).find('.sub-menu').toggleClass('sub-menu-down');
	})
});

var slidepanelOpened = false;

function openSlidepanel(){
	$('.slideout-panel').addClass('slideout-panel-slided');
	$('html').addClass('slideout-open');
	slidepanelOpened = true;
}

function closeSlidepanel(){
	$('.slideout-panel').removeClass('slideout-panel-slided');
	setTimeout(function(){
		$('html').removeClass('slideout-open');
	}, 200);
	slidepanelOpened = false;
}

function toggleSlidepanel(){
	slidepanelOpened?closeSlidepanel():openSlidepanel();
}

function setContentMinHeight(){
	var fh = $("#footer").height();
	var wh = $(window).height();
	var nh = $('#nav').height();
	$('#content').css('min-height', (wh - fh)+'px');
}

function setNavActive(id){
	$('#nav #'+id).addClass("active");
}

/**
 * 获取ajax数据
 * @param json
 	* obj 表示ajax等待效果放的位置(如果有等待效果可加，没有可不加)
 	* call（回调函数） 表示取得数据成功后需要做的事情
 * flag 是否异步
 */
function getAjaxData(json,flag) {
	$(json.obj).find("tbody:first").empty();
	
	$.ajax({
		url: json.url,
		type: "POST",
		data: json.param,
		dataType: "json",
		async: flag,
		beforeSend: function(){
			$(json.obj).addClass("ajaxLoading");
		},
		success: function(data){
			json.call(data);
		},
		complete: function(){
			$(json.obj).removeClass("ajaxLoading");
			if( json.complete != null)
				json.complete();
		},
		error: function(){
			if( json.error != null)
				json.error();
		}
	});
}

function loadProperties(){
	jQuery.i18n.properties({
		name:'i18nstring',
		path:rootPath+'/resources/js/i18n/',
		mode:'map'	
	});
}

function showAlert(t, c, Func){
	$("#alertModal .modal-title").text(t);
	$("#alertModal .modal-body p").text(c);
	$("#alertModal").modal('show');
	
	$('#alertModal').on('hidden.bs.modal', function(event){
		if(Func){
			Func();
		}
	});
}

function showConfirm(title,message,yesFn,noFn){
	$('#confirmModal').find('.modal-title').text(title);
	$('#confirmModal').find('.modal-body p').text(message);
	
	$("#confirmModal").modal('show');
	
	$('#confirmModal').find('.modal-footer #confirm').unbind('click');
	$('#confirmModal').find('.modal-footer #confirm').on('click', function(){
		if( yesFn ){
			yesFn();
		}
		$("#confirmModal").modal('hide');
	});
	
	$('#confirmModal').find('.modal-footer #cancel').unbind('click');
	$('#confirmModal').find('.modal-footer #cancel').on('click', function(){
		if( noFn ){
			noFn();
		}
		$("#confirmModal").modal('hide');
	});
}

function showWave(comtradeData){
	var w = $(window).width()-20;
	var h = $(window).height()-60;
	$('#waveModal .modal-dialog').attr("style", 'width:'+w+'px'+';height:'+h+'px');
	$('#waveModal .modal-header').attr("style", 'width:'+w+'px'+';height:'+h+'px');
	$('#waveModal .modal-header #wave-graph').attr("style", 'width:'+(w-30)+'px'+';height:'+(h-60)+'px');
	$('#waveModal .modal-header #wave-hdr').attr("style", 'width:'+(w-30)+'px'+';height:'+(h-60)+'px;');
		
	$('#waveModal .nav-tabs a:first').tab('show');
	$('#waveModal').modal('show');
	
	$('#waveModal').unbind('shown.bs.modal');
	$('#waveModal').on('shown.bs.modal', function (e) {
		wave_graph(comtradeData);	
		if( comtradeData.comtrade.hdr != null ){
			wave_hdr(comtradeData.comtrade.hdr);
			$('#waveModal .nav-tabs a[href="#wave-hdr"]').unbind('shown.bs.tab');
			$('#waveModal .nav-tabs a[href="#wave-hdr"]').on('shown.bs.tab', function(e){
				$('#wave-hdr').scrollTop(0);
			});			
		}
	});
}

function wave_hdr_hide(){
	$('#wave-hdr .panel-zero').hide();
	$('#wave-hdr .panel-success').hide();
	$('#wave-hdr .panel-info').hide();
	$('#wave-hdr .panel-warning').hide();
	$('#wave-hdr .panel-danger').hide();
	$('#wave-hdr .panel-primary').hide();
}

function wave_hdr_show(){
	$('#wave-hdr .panel-zero').show();
	$('#wave-hdr .panel-success').show();
	$('#wave-hdr .panel-info').show();
	$('#wave-hdr .panel-warning').show();
	$('#wave-hdr .panel-danger').show();
	$('#wave-hdr .panel-primary').show();
}

function wave_hdr(hdrData){
	if( hdrData == null )
		return;
	if( hdrData.result == 0 ){
		$('#wave-hdr .alert').html($.i18n.prop('b_hdrnotexist'));
		$('#wave-hdr .alert').show();
		wave_hdr_hide();
		return;
	}
	if( hdrData.result == 1 ){
		$('#wave-hdr .alert').html($.i18n.prop('b_hdrformaterror'));
		$('#wave-hdr .alert').show();
		wave_hdr_hide();
		return;
	}
	$('#wave-hdr .alert').hide();
	wave_hdr_show();
	wave_setHdrBrief(hdrData);
	wave_setFaultInfo(hdrData);
	wave_setTripInfo(hdrData);
	wave_setDigitalStatus(hdrData);
	wave_setDigitalEvent(hdrData);
	wave_setSettingValue(hdrData);
}
function wave_setHdrBrief(hdrData){
	var html = "<tr>";
	html += "<td width='16%' class='odd'>"+$.i18n.prop('b_faultstarttime')+"</td>";
	html += "<td width='16%' >"+hdrData.FaultStartTime+"</td>";
	html += "<td width='16%' class='odd'>"+$.i18n.prop('b_faultduration')+"</td>";
	html += "<td width='16%' >"+hdrData.FaultKeepingTime+"</td>";
	html += "<td width='16%' class='odd'>"+$.i18n.prop('b_filesize')+"</td>";
	html += "<td width='16%' >"+hdrData.DataFileSize+"</td>";
	html += "</tr>";
	$('#waveModal_breifTb tbody').html(html);	
}

function wave_setFaultInfo(hdrData){
	if(hdrData.FaultInfo){
		var html="";
		var col = 0;
		for ( var i = 0; i < hdrData.FaultInfo.length; i++) {
			var info = hdrData.FaultInfo[i];
			if( col == 0 ){
				html += "<tr>";
			}
			html += "<td width='16%' class='odd'>" +info.name+"</td>";
			var unit = '';
			if( info.unit && info.unit != null ){
				unit = info.unit;
			}
			html += "<td width='16%'>"+info.value+" "+unit+"</td>";
			col++;
			if( col == 3 ){
				html+="</tr>";
				col = 0;
			}				
		}
		if( col == 0 )
			html += "</tr>";
		$('#waveModal_faultinfoTb tbody').html(html);
	}
}

function wave_setTripInfo(hdrData){
	if(hdrData.TripInfo){
		var html = "";
		for( var i = 0; i < hdrData.TripInfo.length; i++ ){
			var info = hdrData.TripInfo[i];
			if( i%2 == 0 )
				html += "<tr>";
			else
				html += "<tr class='odd'>";
			html += "<td>"+info.time+"</td>";
			html += "<td>"+info.name+"</td>";
			html += "<td>"+info.value+"</td>";
			html += "<td>"+info.phase+"</td>";
			if( info.FaultInfo ){
				html += "<td><ol>";
				for( var k = 0; k < info.FaultInfo.length; k++ ){
					var fault = info.FaultInfo[k];
					var unit = '';
					if( info.unit && info.unit != null ){
						unit = info.unit;
					}
					html += "<li>"+fault.name+"&nbsp;&nbsp;"+fault.value+" "+unit+"</li>";
				}
				html += "</ol></td>";
			}else{
				html += "<td></td>";
			}
			
			html += "</tr>";
		}
		$('#waveModal_tripinfoTb tbody').html(html);
	}
}

function wave_setDigitalStatus(hdrData){
	if(hdrData.DigitalStatus){
		var html="";
		var col = 0;
		for ( var i = 0; i < hdrData.DigitalStatus.length; i++) {
			var info = hdrData.DigitalStatus[i];
			if( col == 0 ){
				html += "<tr>";
			}
			html += "<td width='16%' class='odd'>" +info.name+"</td>";
			html += "<td width='16%'>"+info.value+"</td>";
			col++;
			if( col == 3 ){
				html+="</tr>";
				col = 0;
			}				
		}
		if( col == 0 )
			html += "</tr>";
		$('#waveModal_distatusTb tbody').html(html);
	}
}

function wave_setDigitalEvent(hdrData){
	if(hdrData.DigitalEvent){
		var html = "";
		for( var i = 0; i < hdrData.DigitalEvent.length; i++ ){
			var info = hdrData.DigitalEvent[i];
			if( i%2 == 0 )
				html += "<tr>";
			else
				html += "<tr class='odd'>";
			html += "<td>"+info.time+"</td>";
			html += "<td>"+info.name+"</td>";
			html += "<td>"+info.value+"</td>";
			html += "</tr>";
		}
		$('#waveModal_dieventTb tbody').html(html);
	}
}

function wave_setSettingValue(hdrData){
	if(hdrData.SettingValue){
		var html="";
		var col = 0;
		for ( var i = 0; i < hdrData.SettingValue.length; i++) {
			var info = hdrData.SettingValue[i];
			if( col == 0 ){
				html += "<tr>";
			}
			var unit = '';
			if( info.unit && info.unit != null ){
				unit = info.unit;
			}
			html += "<td width='16%' class='odd'>" +info.name+"</td>";
			html += "<td width='16%'>"+info.value+" "+unit+"</td>";
			col++;
			if( col == 3 ){
				html+="</tr>";
				col = 0;
			}				
		}
		if( col == 0 )
			html += "</tr>";
		$('#waveModal_settingTb tbody').html(html);
	}
}

function wave_graph(data, height){
	$('#wave-graph').jscomtrade({
		lang: {
			b_time: $.i18n.prop('b_time'),
			b_curdi: $.i18n.prop('b_curdi'),
			b_primarycursor: $.i18n.prop('b_primarycursor'),
			b_secondcursor: $.i18n.prop('b_secondcursor'),
			b_effectivevalue: $.i18n.prop('b_effectivevalue'),
			b_reset: $.i18n.prop('b_reset'),
			b_action: $.i18n.prop('b_action')
		},
        comtrade:data.comtrade		
	});
}

function setipvalue(obj, ip){
	var ips = ip.split('.');
	var inputs = $(obj).children('.item');
	if( 4 == inputs.length && 4 == ips.length ){
		for(var i=0; i < 4 ; i++ ){
			$(inputs[i]).val(ips[i]);
		}
	}
}

function getipvalue(obj){
	var ret = '';
	var inputs = $(obj).children('.item');
	if( 4 == inputs.length ){
		for(var i=0; i < 4 ; i++ ){
			ret += $(inputs[i]).val();
			if( i != 3 ){
				ret += '.';
			}
		}
	}
	return ret;
}

function clearipvalue(obj){
	var ret = '';
	var inputs = $(obj).children('.item');
	if( 4 == inputs.length ){
		for(var i=0; i < 4 ; i++ ){
			$(inputs[i]).val('');
		}
	}
	return ret;
}

function vaildateipctrl(obj){
	var ret = true;
	var inputs = $(obj).children('.item');
	if( inputs.length == 4 && ips.length == 4 ){
		for(var i=0; i < 4 ; i++ ){
			var v = $(inputs[i]).val();
			if( v == '' || v.length==0 ){
				ret = false;
				break;
			}
				
		}
	}
	return ret;
}

function onipitemkeyup(e){
	this.value=this.value.replace(/[^0-9]+/,'');
	var v = parseInt(this.value);
	if( this.value.length > 1 ){
		this.value=v;
	}
	if( v > 255 ){
		this.value=this.value.substr(0,this.value.length-1);
	}

	if( (3 == this.value.length && ( e.keyCode >= 48 && e.keyCode <=57)) ||
			(( e.keyCode == 190 && this.value != '') && e.keyCode != 8)){
		if( $(this).next() ){
			$(this).next().focus();
		}
	}

	if( (e.keyCode == 8) && this.value.length==0){
		if( $(this).prev() ){
			$(this).prev().focus();
		}
	}
}

function relogin(){
	window.location.href= rootPath;
}

function setCookie(c_name,value,expiredays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
		((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function getCookie(c_name)
{
	if (document.cookie.length>0)
	{
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
	  { 
	    c_start=c_start + c_name.length+1; 
	    c_end=document.cookie.indexOf(";",c_start);
	    if (c_end==-1) 
	    	c_end=document.cookie.length;
	    return unescape(document.cookie.substring(c_start,c_end));
	  } 
	}
	return "";
}

