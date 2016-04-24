
var comtradeParam={};
function setActiveComtrade(needDown,path, name){
	comtradeParam.path = path;
	comtradeParam.name = name;
	comtradeParam.data = null;
	if( needDown == true){
		getComtradeData();
	}
}

function getComtradeData(){
	var param={};
	param.filepath=comtradeParam.path;
	var dataParam = {
		    url: rootPath + "/wave/read",
			param:param,
			call: function(data) {
				if(data!=null && data.comtrade.err!=1) {
					//波形文件 数据
					comtradeParam.data=data;
				}
			}
	};
	getAjaxData(dataParam,false);
}
function showComtrade(){
	if(validateVar(comtradeParam.data) == false){
		getComtradeData();
	}
	if(validateVar(comtradeParam.data) == true){
		showWave(comtradeParam.data);
	}else{
		showAlert($.i18n.prop('file_notfound'), $.i18n.prop('file_notfound')+":"+comtradeParam.path);
	}
}

function exportComtrade(){
	var url = rootPath+"/runview/recordfile/export?filepath="+comtradeParam.path+"&filename="+comtradeParam.name+"";
	url = url.replace(/\#/g, "%23");
	url = url.replace(/\+/g, "%2B");
	url = url.replace(/\ /g, "%20");
	url = encodeURI(url);
	window.location.href=url;
}

function printComtrade(){
	printWave();
	location.reload();
}

function printWave(){
	var oldBody = $('body').html();
	var html = "<div class='printWave'></div>";
	$('body').html(html);
	var options = window.JSComtrade.chartObj.getOptions();
	options.chart.mode='print';
	$('.printWave').jscomtrade(options);
	window.print();
	//$('body').html(oldBody);
}

function showWave(comtradeData){
	var w = $(window).width()-20;
	var h = $(window).height()-60;
	
	$('#waveModal .modal-dialog').attr("style", 'width:'+w+'px'+';height:'+h+'px');
	$('#waveModal .modal-header').attr("style", 'width:'+w+'px'+';height:'+h+'px');
	$('#waveModal .modal-header #wave-graph').attr("style", 'width:'+(w-30)+'px'+';height:'+(h-60)+'px');
	
	$('#waveModal').modal('show');
	
	$('#waveModal').unbind('shown.bs.modal');
	$('#waveModal').on('shown.bs.modal', function (e) {
		wave_graph(comtradeData);
	});
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

function wave_hzoom(zoomin){
	window.JSComtrade.chartObj.scaleTimespace(zoomin);
}

function wave_vzoom(zoomin){
	window.JSComtrade.chartObj.scaleChannel(zoomin);
}

function wave_selectChls(){
	var w = $(window).width()-20;
	var h = $(window).height()-60;
	
	$('#waveSelChlModal .modal-dialog').attr("style", "width:800px");
	
	$('#waveSelChlModal').modal('show');
	
	$('#waveSelChlModal').unbind('shown.bs.modal');
	$('#waveSelChlModal').on('shown.bs.modal', function (e) {
		var chls = window.JSComtrade.chartObj.getChannels();
		if( chls == null )
			return;
		var htmlai='',htmldi='';
		for( var i in chls ){
			var c = chls[i];
			if( c.type === 'AI' ){
				htmlai += "<tr id='"+i+"'>";
				htmlai += "<td width='30%'>"+ "<input type='checkbox' data-toggle='toggle'"+(c.show==true?'checked':'')+"/>" + "</td>";
				htmlai += "<td width='50%'>"+c.name+"</td>"; 
				htmlai += "<td width='20%'>"+c.phase+"</td>";
				htmlai += "</tr>";
			}else if( c.type === "DI"){
				htmldi += "<tr id='"+i+"'>";
				htmldi += "<td width='30%'>"+ "<input type='checkbox' id='"+c.changed+"' data-toggle='toggle'"+(c.show==true?'checked':'')+"/>" + "</td>";
				htmldi += "<td width='50%'>"+c.name+"</td>"; 
				htmldi += "<td width='20%'>"+(c.changed==true?$.i18n.prop('yes'):$.i18n.prop('no'))+"</td>";
				htmldi += "</tr>";
			}
		}
		$('#waveSelChlModal #aichlsTb tbody').html(htmlai);
		$('#waveSelChlModal #dichlsTb tbody').html(htmldi);
		
		$('#waveSelChlModal tbody :checkbox').bootstrapToggle({
			size:'mini',
			on:$.i18n.prop('toggle_show'),
			off:$.i18n.prop('toggle_hide')
		});
	});
}

function filterchl_sel_all_ai(){
	$('#waveSelChlModal #aichlsTb tbody :checkbox').each(function(){
		$(this).bootstrapToggle('on');
	});
}

function filterchl_desel_all_ai(){
	$('#waveSelChlModal #aichlsTb tbody :checkbox').each(function(){
		$(this).bootstrapToggle('off');
	});
}

function filterchl_sel_all_di(){
	$('#waveSelChlModal #dichlsTb tbody :checkbox').each(function(){
		$(this).bootstrapToggle('on');
	});
}

function filterchl_desel_all_di(){
	$('#waveSelChlModal #dichlsTb tbody :checkbox').each(function(){
		$(this).bootstrapToggle('off');
	});
}

function filterchl_sel_changed_di(){
	$('#waveSelChlModal #dichlsTb tbody :checkbox').each(function(){
		var id = $(this).attr('id');
		if( id=='true'){
			$(this).bootstrapToggle('on');
		}else{
			$(this).bootstrapToggle('off');
		}
	});
}

function filterchl_ok(){
	$('#waveSelChlModal tbody tr').each(function(){
		var isshow=$(this).find(':checkbox').prop('checked');
		var index=$(this).attr('id');
		window.JSComtrade.chartObj.setChlShow(index, isshow);
	});
	$("#waveSelChlModal").modal('hide');
	window.JSComtrade.chartObj.reRender();
}

function wave_vector(){
	var chls = window.JSComtrade.chartObj.getChannels();
	if( chls == null )
		return;
	var htmlai='';
	for( var i in chls ){
		var c = chls[i];
		if( c.type === 'AI' ){
			htmlai += "<tr id='"+i+"'>";
			htmlai += "<td class='checkbox'>"+ "<label><input type='checkbox' class='chlname'>" +c.name+ "</input></label></td>";
			htmlai += "<td class='angle'></td>";
			htmlai += "<td class='amp'></td>";
			htmlai += "</tr>";
		}else{
			break;
		}
	}
	$('#vectorDialog tbody').html(htmlai);
	$('#vectorDialog').show();
	var w = $('#vectorDialog .nomodal-body').width();
	w = 7*w/12;
	$('#vectorDialog .vector-graph').jsvectorgraph({chart:{
		width:w
	}});
	$('#vectorDialog tbody :checkbox').change(function(){
		refresh_waveVector();
	});
	window.JSComtrade.chartObj.setCursorMovingListener(vector_update);

}

function refresh_waveVector(){
	var s= window.JSComtrade.chartObj.getCursorSample();
	this.vector_update(s.s1,s.s2);
}

function getHarmonic(s1, s2, chlIndex, harmonicTimes){
	if( s1 == s2 ){
		return math.complex(-1,0);
	}
	var iN = s2-s1;
	var chls = window.JSComtrade.chartObj.getChannels();
	var chl = chls[chlIndex];
	var Xr=0.0,Xi=0.0,fV=0.0,fA=0.0;
	for( var t = s1, j=0; t < s2; t++,j++){
		var fTemp = chl.data[t]-chl.data[t-1];
		Xr += fTemp * math.sin(harmonicTimes*(j+1)/iN*2*math.PI);
		Xi += fTemp * math.cos(harmonicTimes*(j+1)/iN*2*math.PI);
	}
	fV = 2.0 * math.sin(math.PI*harmonicTimes/iN);//差分修正系数
	fA = (0.5- 1.0*harmonicTimes/iN)*Math.PI;
	return math.divide( math.complex(2*Xr/iN, 2*Xi/iN), math.complex(fV*Math.cos(fA), fV*math.sin(fA)) );
}

function vector_update(s1, s2){
	var chls=new Array();
	$('#vectorDialog tbody tr').each(function(){
		var chlid = $(this).attr('id');
		var vector = getHarmonic(s1, s2, chlid, 1);
		var angle = ((math.arg(vector)*180/math.PI).toFixed(2));
		var amp = (math.abs(vector)).toFixed(2);
		$(this).find('.angle').html( angle+'\&deg' );
		$(this).find('.amp').text( amp );
		if( $(this).find(':checkbox').prop('checked') == true ){
			var c = {};
			c.index = chlid;
			c.angle = angle;
			c.amp = amp;
			c.name = $(this).find(':checkbox').parent().text();
			chls.push(c);
		}
		if(window.JSVectorGraph.chartObj){
			window.JSVectorGraph.chartObj.updateChls(chls);
		}
	});
}

function closeVectorDlg(){
	if(window.JSComtrade.chartObj){
		window.JSComtrade.chartObj.setCursorMovingListener(vector_update);
	}
}

function wave_harmonic(){
	var chls = window.JSComtrade.chartObj.getChannels();
	if( chls == null )
		return;
	var htmlai='';
	for( var i in chls ){
		var c = chls[i];
		if( c.type === 'AI' ){
			htmlai += "<tr id='"+i+"'>";
			htmlai += "<td class='radio'>"+ "<label><input type='radio' name='chlsRadios' id='"+i+"'>" +c.name+ "</input></label></td>";
			htmlai += "</tr>";
		}else{
			break;
		}
	}
	$('#harmonicDialog tbody').html(htmlai);
	$('#harmonicDialog').show();
	var w = $('#harmonicDialog .nomodal-body').width();
	w = 7*w/12;
	//$('#harmonicDialog .harmonic-graph').jsvectorgraph({chart:{
	//	width:w
	//}});
	harmonicParam={
	        chart: {
	            type: 'bar',
	            animation:false,
	            height:360
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: ['DC', '1', '2', '3', '4','5','6','7','8','9','10','11','12','13','14','15'],
	            title: {
	                text: null
	            }
	        },
	        yAxis: {
	        	visible:false
	        },
	        plotOptions: {
	            bar: {
	                dataLabels: {
	                    enabled: true
	                }
	            },
	            series:{
	            	animation: false
	            }
	        },
	        tooltip:{
	        	enabled:false
	        },
	        legend: {
	        	enabled:false
	        },
	        credits: {
	            enabled: false
	        },
	        series: [{
	        	name:'谐波',
	        	data:[]
	        }]
	    };
	$('#harmonicDialog .harmonic-graph').highcharts(harmonicParam);
	$('#harmonicDialog tbody :radio').change(function(){
		refresh_waveHarmonic();
	});
	window.JSComtrade.chartObj.setCursorMovingListener(harmonic_update);
}

function refresh_waveHarmonic(){
	var s= window.JSComtrade.chartObj.getCursorSample();
	this.harmonic_update(s.s1,s.s2);
}

function harmonic_update(s1, s2){
	var chart = $('#harmonicDialog .harmonic-graph').highcharts();
	var values = new Array;
	values.push(0.0);
	var chlid = $('#harmonicDialog tbody :radio:checked').attr('id');
	for(var i = 1; i < 16; i++ ){
		var vector = getHarmonic(s1, s2, chlid, i);
		var amp = (math.abs(vector)).toFixed(2);
		values.push(parseFloat(amp));
	}
	chart.series[0].update({
		data:values
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

function closeDialog(event, func){
	var parent=$(event.target).parent();
	while(true){
		if(parent.hasClass('nomodal')){
			break;
		}
		parent = parent.parent();
	}
	if(func ){
		func();
	}
	parent.hide();
}
