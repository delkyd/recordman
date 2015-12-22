$(function(){
	setNavActive('nav_faultrecord');
	$('.result-zone .gallery .item').click(clickitem);
	$('.gallery .toolbar .export').click(function(){
		alert('export file');
		return false;
	});
});

function clickitem(){
	var param={};
	param.filepath='F:/stdown/comtrade/PCS931/PL2201A_RCD_00246_20151124_072435_615_f';
	var dataParam = {
		    url: "../wave/read",
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