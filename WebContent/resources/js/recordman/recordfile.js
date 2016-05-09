
var showStyle='icon';
$(function(){
	setNavActive('nav_faultrecord');
	
	showStyle=getCookie('recordfileShowStyle');
	if( showStyle===''){
		showStyle = 'list';
	}
	setCheck(showStyle);

	$('#datetimepicker1').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss',
		locale: $.i18n.prop('locale')
	});
	$('#datetimepicker2').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss',
		locale: $.i18n.prop('locale')
	});
	setdate();
	$('#source').change(find);
	$("#period").change(setdate);
	$("#query").click(find);
	
	$('#option1').on('change', function(){
		showStyle='icon';
		setCookie('recordfileShowStyle', showStyle);
		find();
	});
	$('#option2').on('change', function(){
		showStyle='list';
		setCookie('recordfileShowStyle', showStyle);
		find();
	});
});

function setCheck(s){
	$('#option1').removeAttr('checked');
	$('#option1').parent().removeClass('active');
	$('#option2').removeAttr('checked');
	$('#option2').parent().removeClass('active');
	if( s === 'icon'){
		$('#option1').attr('checked');
		$('#option1').parent().addClass('active');
	}else if( s === 'list'){
		$('#option2').attr('checked');
		$('#option2').parent().addClass('active');
	}
}

function setdate(){
	var period = parseInt($("#period").val());
	if( period == CONST.PERIOD.NONE ){
		$('#datetimepicker1').show();
		$('#datetimepicker2').show();
		$('#query').show();
	}else{
		var n = new Date();
		var s = new moment(n);
		switch(period){
		case CONST.PERIOD.DAY:
			{
			s.subtract(1,'d');
			break;
			}
		case CONST.PERIOD.WEEK:
			{
			s.subtract(7,'d');
			break;
			}
		case CONST.PERIOD.MONTH:
			{
			s.subtract(1,'M');
			break;
			}
		case CONST.PERIOD.HALFYEAR:
			{
			s.subtract(6,'M');
			break;
			}
		case CONST.PERIOD.YEAR:
			{
			s.subtract(1,'y');
			}
		}
		$('#datetimepicker1').data("DateTimePicker").date(s);
		$('#datetimepicker2').data("DateTimePicker").date(n);
		$('#datetimepicker1').hide();
		$('#datetimepicker2').hide();
		$('#query').hide();
		find();
	}
}

function clickitem(event){
}

function openitem(path, name){
	setActiveComtrade(true,path,name);
	showComtrade();
	
}

function exportitem(path, name){
	setActiveComtrade(false,path,name);
	exportComtrade();
}

function find(){
	var param={};
	var s = $('#datetimepicker1').data("DateTimePicker").date();
	var n = $('#datetimepicker2').data("DateTimePicker").date();
	param.startDate = s.format();
	param.endDate = n.format();
	var dataParam = {
		    url: rootPath + "/runview/recordfile/files",
			param:param,
			call: function(data) {
				if( data.files != null ){
					if( showStyle === "icon"){
						fillData( data.files );
					}else if( showStyle === "list"){
						fillData_tb( data.files );
					}
				}
			}
	};
	getAjaxData(dataParam,false);
}

function getColor(index){
	var c = "blue";
	switch( index % 4 ){
	case 0:
		c = "blue";
		break;
	case 1:
		c = "yellow";
		break;
	case 2:
		c = "green";
		break;
	case 3:
		c = "pink";
		break;
	}
	return c;
}

function fillData(data){
	var html = "";
	for( var i in data ){
		var day = data[i];
			html += "<div class='day-zone " + getColor(i) + "'><div class='heading color'><h1>"+
			day.day + "</h1><span>" + $.i18n.prop('file_count') + ":" + day.fileNum + "    "+ $.i18n.prop('fault_count') + ":" + day.faultNum + "</span></div>";
			html += "<div class='gallery'>";
			 for( var fi in day.f ){
				 var f = day.f[fi];
				 var path = f.savePath+f.name;
				 html += "<div class='item' id='"+ path + "'><div class='toolbar'><div class='icon open' onclick="+ 
				 		'"openitem('+ "'" + path + "','"+f.name+ "')\"></div>" + 
				 		"<div class='icon export' onclick=\"exportitem('"+path+"','"+f.name+"')\"></div></div>";
				 html += "<h5>" + f.shortTime + "</h5>";
				 html += "<h5 class='filename'>" + f.name + "</h5>";
				 html += "<h5>" + $.i18n.prop('faulttype_'+f.faultType) + "</h5>";
				 html += "<h5>" + $.i18n.prop('fault_distance')+":"+(validateVar(f.distance)?(f.distance + "(km)"):"-")+ "</h5></div>";
			 }
			html += "</div></div>";
	}
	$('.result-zone').html(html);
	$('.result-zone .gallery .item').click(clickitem);
}

function fillData_tb(data){
	var html = "<table class=\"table table-condensed table-hover\"><thead><tr>";	
	html += "<th>"+$.i18n.prop('file_thead_date')+"</th>";
	html += "<th>"+$.i18n.prop('file_thead_name')+"</th>";
	html += "<th>"+$.i18n.prop('file_thead_faulttype')+"</th>";
	html += "<th>"+$.i18n.prop('file_thead_distance')+"</th>";
	html += "<th></th></tr></thead><tbody>";	
	for( var i in data ){
		var day = data[i];
			 for( var fi in day.f ){
				 var f = day.f[fi];
				 var path = f.savePath+f.name;
				 html += "<tr>";
				 html += "<td>"+ f.longTime + "</td>";
				 html += "<td>"+ f.name + "</td>";
				 html += "<td>"+ $.i18n.prop('faulttype_'+f.faultType) + "</td>";
				 html += "<td>"+ (validateVar(f.distance)?(f.distance + "(km)"):"-")+"</td>";
				 html += "<td><button class='customBtn showBtn' onclick=\"openitem('"+path+"','"+f.name+"')\" title='"+$.i18n.prop('view')+"'></button>";
					html += "<button class='customBtn exportBtn' onclick=\"exportitem('"+path+"','"+f.name+"')\" title='"+$.i18n.prop('export')+"'></button></td>";
				 html += "</tr>";
			 }
	}
	html += "</tbody></table>";
	$('.result-zone').html(html);
}
