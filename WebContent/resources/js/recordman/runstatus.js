$(function(){
	setNavActive('nav_runstatus');
	
	$('#test').click(function(){
		var param={};
		param.filepath='D:/stdown/comtrade/20151121_111226_244';
		var dataParam = {
			    url: rootPath+"/wave/read",
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
	});
	$('#another').click(function(){
		var param={};
		param.filepath='D:/stdown/comtrade/test';
		var dataParam = {
			    url: rootPath+"/wave/read",
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
	});
});