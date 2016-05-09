
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
	url = encodeURI(encodeURI(url));
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
	var w = 800;
	var h = $(window).height()-160;
	
	$('#waveSelChlModal .modal-dialog').attr("style", 'width:'+w+'px');
	$('#waveSelChlModal .modal-dialog .scroll').attr("style", 'height:'+(h-80)+'px');
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
				htmlai += "<td >"+ "<input type='checkbox' data-toggle='toggle'"+(c.show==true?'checked':'')+"/>" + "</td>";
				htmlai += "<td >"+c.name+"</td>"; 
				htmlai += "<td >"+c.phase+"</td>";
				htmlai += "</tr>";
			}else if( c.type === "DI"){
				htmldi += "<tr id='"+i+"'>";
				htmldi += "<td >"+ "<input type='checkbox' id='"+c.changed+"' data-toggle='toggle'"+(c.show==true?'checked':'')+"/>" + "</td>";
				htmldi += "<td >"+c.name+"</td>"; 
				htmldi += "<td >"+(c.changed==true?$.i18n.prop('yes'):$.i18n.prop('no'))+"</td>";
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
			if( i==='0' || i==='1' || i==='2' || i===0 || i===1 || i===2 ){
				htmlai += "<td class='checkbox'>"+ "<label><input type='checkbox' checked class='chlname'>" +c.name+ "</input></label></td>";
			}else{
				htmlai += "<td class='checkbox'>"+ "<label><input type='checkbox' class='chlname'>" +c.name+ "</input></label></td>";
			}
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
	refresh_waveVector();
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
		var fTemp = chl.data[t+1]-chl.data[t];
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
		window.JSComtrade.chartObj.setCursorMovingListener(null);
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
			if( i === 0 || i==='0'){
				htmlai += "<td class='radio'>"+ "<label><input type='radio' checked name='chlsRadios' id='"+i+"'>" +c.name+ "</input></label></td>";
			}else{
				htmlai += "<td class='radio'>"+ "<label><input type='radio' name='chlsRadios' id='"+i+"'>" +c.name+ "</input></label></td>";
			}
			
			htmlai += "</tr>";
		}else{
			break;
		}
	}
	$('#harmonicDialog tbody').html(htmlai);
	$('#harmonicDialog').show();

	$('#harmonicDialog tbody :radio').change(function(){
		refresh_waveHarmonic();
	});
	$('#harmonicDialog .harmonic-graph').highcharts({
        chart: {
            type: 'bar',
            animation:false,
            height:360
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['1', '2', '3', '4','5','6','7','8','9','10','11','12','13','14','15'],
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
    });
	window.JSComtrade.chartObj.setCursorMovingListener(harmonic_update);
	refresh_waveHarmonic();
}

function refresh_waveHarmonic(){
	var s= window.JSComtrade.chartObj.getCursorSample();
	this.harmonic_update(s.s1,s.s2);
}

function harmonic_update(s1, s2){
	var chart = $('#harmonicDialog .harmonic-graph').highcharts();
	var values = new Array;
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

function closeHarmonicDlg(){
	if(window.JSComtrade.chartObj){
		window.JSComtrade.chartObj.setCursorMovingListener(null);
	}
}

function getV(chl,s1,s2){
	var chlindex = getChannelIndex(chl);
	if( typeof chlindex == undefined || chlindex == 'undefined')
		return math.complex(0,0);
	return getHarmonic(s1,s2,chlindex,1);
}

function getChannelIndex(type){
	switch(type){
	case 'ua':
		return $('#ImpedanceDialog #imp_ua').val();
	case 'ub':
		return $('#ImpedanceDialog #imp_ub').val();
	case 'uc':
		return $('#ImpedanceDialog #imp_uc').val();
	case 'ia':
		return $('#ImpedanceDialog #imp_ia').val();
	case 'ib':
		return $('#ImpedanceDialog #imp_ib').val();
	case 'ic':
		return $('#ImpedanceDialog #imp_ic').val();
	}
}

/**
 * @param s1 给定波段的第一个采样位置
 * @param s2 给定波段的最后一个采样位置
 * @param phase 需要计算的阻抗相别.1-a;2-b;3-c;4-ab;5-bc;6-ca
 * @param re 零序补偿实部
 * @param im 零序补偿虚部
 */
function getImpedance(s1, s2, phase, re, im){
	var kGround = math.complex(re, im);
	switch(phase){
	case 1://a
		{
		var fi = math.subtract(getV('ia',s1,s2),getV('ib',s1,s2));
		if( math.abs(fi) > 0.00001 ){
			var fu = math.subtract(getV('ua',s1,s2),getV('ub',s1,s2));
			return math.divide(fu,fi);
		}else{
			return math.complex(0,0);
		}
		break;
		}
	case 2://b
		{
		var fi = math.subtract(getV('ib',s1,s2),getV('ic',s1,s2));
		if( math.abs(fi) > 0.00001 ){
			var fu = math.subtract(getV('ub',s1,s2),getV('uc',s1,s2));
			return math.divide(fu,fi);
		}else{
			return math.complex(0,0);
		}
		break;
		}
	case 3://c
		{
		var fi = math.subtract(getV('ic',s1,s2),getV('ia',s1,s2));
		if( math.abs(fi) > 0.00001 ){
			var fu = math.subtract(getV('uc',s1,s2),getV('ua',s1,s2));
			return math.divide(fu,fi);
		}else{
			return math.complex(0,0);
		}
		break;
		}
	case 4://ab
		{
		var ia = getV('ia',s1,s2);
		var ib = getV('ib',s1,s2);
		var ic = getV('ic',s1,s2);
		var i0 = math.add(math.add(ia,ib),ic);
		var fi = math.add(ia, math.multiply(kGround,i0) );
		if( math.abs(fi) > 0.00001 ){
			var fu = getV('ua',s1,s2);
			return math.divide(fu,fi);
		}
		break;
		}
	case 5://bc
		{
		var ia = getV('ia',s1,s2);
		var ib = getV('ib',s1,s2);
		var ic = getV('ic',s1,s2);
		var i0 = math.add(math.add(ia,ib),ic);
		var fi = math.add(ib, math.multiply(kGround,i0) );
			if( math.abs(fi) > 0.00001 ){
				var fu = getV('ub',s1,s2);
				return math.divide(fu,fi);
			}
			break;
		}
	case 6://ca
		{
		var ia = getV('ia',s1,s2);
		var ib = getV('ib',s1,s2);
		var ic = getV('ic',s1,s2);
		var i0 = math.add(math.add(ia,ib),ic);
		var fi = math.add(ic, math.multiply(kGround,i0) );
			if( math.abs(fi) > 0.00001 ){
				var fu = getV('uc',s1,s2);
				return math.divide(fu,fi);
			}
			break;
		}
	default:
		{
		return math.complex(0,0);
		}
	}
}

function wave_impedance(){
	var chls = window.JSComtrade.chartObj.getChannels();
	if( chls == null )
		return;
	var htmla='';
	var htmlv='';
	for( var i in chls ){
		var c = chls[i];
		if( c.type === 'AI' ){
			var html = "<option value='"+i+"'>"+c.name+"</option>";
			if( c.unit.toLowerCase() ==='v' || c.unit.toLowerCase()==='kv'){
				htmlv += html;
			}
			if( c.unit.toLowerCase() ==='a' || c.unit.toLowerCase()==='ka'){
				htmla += html;
			}
		}else{
			break;
		}
	}
	$('#ImpedanceDialog #imp_ia').html(htmla);
	$('#ImpedanceDialog #imp_ib').html(htmla);
	$('#ImpedanceDialog #imp_ic').html(htmla);
	$('#ImpedanceDialog #imp_ua').html(htmlv);
	$('#ImpedanceDialog #imp_ub').html(htmlv);
	$('#ImpedanceDialog #imp_uc').html(htmlv);
	autoSetChl();
	var cyccount = getCycCount();
	var cycstart='';
	for(var i = 1; i <= cyccount; i++){
		cycstart += "<option value='"+i+"'>"+i+"</option>";
	}
	$('#ImpedanceDialog #startCyc').html(cycstart);
	$('#ImpedanceDialog #startCyc').val(1);
	$('#ImpedanceDialog #startCyc').change(function(){
		fillEndCyc();
	});
	$('#ImpedanceDialog input').change(function(){
		renderImpedanceLine();
	});
	$('#ImpedanceDialog select').change(function(){
		renderImpedanceLine();
	});
	fillEndCyc();
	$('#ImpedanceDialog').show();
	renderImpedanceLine();
}

function fillEndCyc(){
	var cyccount = getCycCount();
	var start = parseInt($('#ImpedanceDialog #startCyc').val());
	var html='';
	for(var i = start+1; i <= cyccount; i++){
		html += "<option value='"+i+"'>"+i+"</option>";
	}
	$('#ImpedanceDialog #endCyc').html(html);
	var end = start+7;
	if( end > cyccount ){
		end = cyccount;
	}
	$('#ImpedanceDialog #endCyc').val(end);
}

function autoSetChl(){
	var chls = window.JSComtrade.chartObj.getChannels();
	if( chls == null )
		return;
	var ia=false,
		ib=false,
		ic=false,
		ua=false,
		ub=false,
		uc=false;
	for( var i in chls ){
		var c = chls[i];
		if( c.type === 'AI' ){
			if( c.unit.toLowerCase() ==='a' || c.unit.toLowerCase()==='ka'){
				var phase = c.phase.toLowerCase();
				if( phase==='a' && ia===false){
					$('#ImpedanceDialog #imp_ia').val(i);
					ia = true;
				}else if( phase==='b' && ib===false){
					$('#ImpedanceDialog #imp_ib').val(i);
					ib = true;
				}else if( phase==='c' && ic===false){
					$('#ImpedanceDialog #imp_ic').val(i);
					ic=true;
				}
			}
			if( c.unit.toLowerCase() ==='v' || c.unit.toLowerCase()==='kv'){
				var phase = c.phase.toLowerCase();
				if( phase==='a' && ua===false){
					$('#ImpedanceDialog #imp_ua').val(i);
					ua = true;
				}else if( phase==='b' && ub===false){
					$('#ImpedanceDialog #imp_ub').val(i);
					ub = true;
				}else if( phase==='c' && uc===false){
					$('#ImpedanceDialog #imp_uc').val(i);
					uc=true;
				}
			}
		}else{
			break;
		}
		if( ia===true && ib===true && ic===true && ua===true && ub===true && uc===true){
			break;
		}
	}
}

var cycs={};
function getCycCount(){
	var lineFreq = window.JSComtrade.chartObj.getOptions().comtrade.lineFreq;
	var rates = window.JSComtrade.chartObj.getOptions().comtrade.rates;
	if(rates.length <= 0){
		return 0;
	}
	var cyccount=0;
	var samplecount=0;
	for(var i in rates){
		var rate = rates[i];
		if( (rate.rate - lineFreq)>1.0){
			var samplesPreCyc = parseInt(rate.rate/lineFreq);
			var cycnum = parseInt(rate.count/samplesPreCyc);			
			for(var c=0; c<cycnum; c++){
				cycs[c+1]={};
				cycs[c+1].sampleStart=samplecount;
				samplecount += samplesPreCyc;
				cycs[c+1].sampleEnd=samplecount-1;
			}
			cyccount += cycnum;
		}else{
			break;
		}
	}
	return cyccount;
}

function renderImpedanceLine(){
	var cats=new Array;
	var startCyc = parseInt($('#ImpedanceDialog #startCyc').val());
	var endCyc = parseInt($('#ImpedanceDialog #endCyc').val());
	for(var i = startCyc; i <= endCyc; i++){
		cats.push(i);
	}
	var lineFreq = window.JSComtrade.chartObj.getOptions().comtrade.lineFreq;
	var rates = window.JSComtrade.chartObj.getOptions().comtrade.rates;
	
	var v1={},v2={},v3={};
	var bAmp = $('#ImpedanceDialog #impTypeRadios1').prop('checked')
	var bPhase = $('#ImpedanceDialog #impPhaseRadios1').prop('checked');
	if(bPhase){
		v1.name='A';
		v2.name='B';
		v3.name='C';
	}else{
		v1.name='AB';
		v2.name='BC';
		v3.name='CA';
	}
	v1.data=new Array;
	v2.data=new Array;
	v3.data=new Array;
	var series=new Array;
	series.push(v1);
	series.push(v2);
	series.push(v3);
	var kr = $('#ImpedanceDialog #kr').val();
	var kx = $('#ImpedanceDialog #kx').val();
	for(var c = startCyc; c <= endCyc; c++){
		var s1 = cycs[c].sampleStart, s2=cycs[c].sampleEnd;
		for( var j = 0; j < 3; j++){
			if(bAmp){//幅值
				if(bPhase){
					//单相
					series[j].data.push( parseFloat(math.abs(getImpedance(s1,s2,j+1,kr,kx)).toFixed(2)) );
				}else{
					//相间
					series[j].data.push( parseFloat(math.abs(getImpedance(s1,s2,j+1+3,kr,kx)).toFixed(2)) );
				}
			}else{//相角
				if(bPhase){
					//单相
					series[j].data.push( parseFloat((math.arg(getImpedance(s1,s2,j+1,kr,kx))*180/math.PI).toFixed(2)) );
				}else{
					//相间
					series[j].data.push( parseFloat((math.arg(getImpedance(s1,s2,j+1+3,kr,kx))*180/math.PI).toFixed(2)) );
				}
			}
		}
	}
	
	
	$('#ImpedanceDialog .Impedance-graph').highcharts({
        title: {
            text: ''
        },
        xAxis: {
            categories: cats
        },
        yAxis: {
            title: {
                text: bAmp?'幅值':'相角 (°)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: bAmp?'':'°',
            crosshairs: true,
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        credits: {
            enabled: false
        },
        series: series
    });
}

function wave_hdr_hide(){
	$('#wave-hdr .panel-zero').hide();
	$('#wave-hdr .panel-success').hide();
	$('#wave-hdr .panel-info').hide();
	$('#wave-hdr .panel-warning').hide();
	$('#wave-hdr .panel-danger').hide();
	$('#wave-hdr .panel-primary').hide();
	$('#wave-hdr .alert').show();
}

function wave_hdr_show(){
	$('#wave-hdr .panel-zero').show();
	$('#wave-hdr .panel-success').show();
	$('#wave-hdr .panel-info').show();
	$('#wave-hdr .panel-warning').show();
	$('#wave-hdr .panel-danger').show();
	$('#wave-hdr .panel-primary').show();
	$('#wave-hdr .alert').hide();
}

function wave_hdr(){
	var w = $(window).width()-40;
	var h = $(window).height()-100;
	
	$('#waveHdrModal .modal-dialog').attr("style", 'width:'+w+'px'+';height:'+h+'px');
	$('#waveHdrModal #wave-hdr').attr("style", 'width:'+(w-30)+'px'+';height:'+(h-60)+'px');
	
	$('#waveHdrModal').modal('show');
	var hdrData = window.JSComtrade.chartObj.getOptions().comtrade.hdr;
	if( hdrData == null )
		return;
	if( hdrData.result == 0 ){
		$('#wave-hdr .alert').html($.i18n.prop('b_hdrnotexist'));
		wave_hdr_hide();
		return;
	}
	if( hdrData.result == 1 ){
		$('#wave-hdr .alert').html($.i18n.prop('b_hdrformaterror'));
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
