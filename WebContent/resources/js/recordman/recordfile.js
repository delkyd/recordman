$(function(){
	setNavActive('nav_faultrecord');
	

	$('#datetimepicker1').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss'
	});
	$('#datetimepicker2').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss'
	});
	setdate();
	$("#period").change(setdate);
	$("#query").click(find);
});

function setdate(){
	var period = parseInt($("#period").val());
	if( period == CONST.PERIOD.NONE ){
		$('#datetimepicker1').show();
		$('#datetimepicker2').show();
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
	}
}

function clickitem(event){
}

function openitem(path){
	var param={};
	param.filepath=path;
	var dataParam = {
		    url: rootPath + "/wave/read",
			param:param,
			call: function(data) {
				if(data!=null && data.comtrade.err!=1) {
					//波形文件 数据处理
					showWave(data);
				}else{
					alert("当前文件不存在！文件路径： "+data.comtrade.fileName);
				}
			}
	};
	getAjaxData(dataParam,false);
}

function exportitem(path){
	alert('export file:' + path);
	return false;
}

function find(){
	var param={};
	var s = $('#datetimepicker1').data("DateTimePicker").date();
	var n = $('#datetimepicker2').data("DateTimePicker").date();
	param.startDate = s.format();
	param.endDate = n.format();
	var dataParam = {
		    url: rootPath + "/recordfile/files",
			param:param,
			call: function(data) {
				if( data.files != null ){
					fillData( data.files );
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
		c = "pink";
		break;
	case 3:
		c = "green";
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
				 html += "<div class='item' id='"+ path + "'><div class='toolbar'><div class='icon open' onclick="+ '"openitem('+ "'" + path + "'"+ ')"></div>' + 
				 		"<div class='icon export' onclick="+ '"exportitem('+ "'" + path + "'" + ')"></div></div>';
				 html += "<h4>" + f.shortTime + "</h4>";
				 html += "<h5>" + f.name + "</h5>";
				 html += "<h3>" + f.faultType + "</h3></div>";
			 }
			html += "</div></div>";
	}
	$('.result-zone').html(html);
	$('.result-zone .gallery .item').click(clickitem);
}
