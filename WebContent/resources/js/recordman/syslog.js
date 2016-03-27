$(function(){
	setNavActive('nav_sys');
	
	$('#datetimepicker1').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss',
		locale: $.i18n.prop('locale')
	});
	$('#datetimepicker2').datetimepicker({
		format:'YYYY-MM-DD HH:mm:ss',
		locale: $.i18n.prop('locale')
	});
	
	var n = new Date();
	var s = new moment(n);
	s.subtract(1,'M');
	$('#datetimepicker1').data("DateTimePicker").date(s);
	$('#datetimepicker2').data("DateTimePicker").date(n);
	
	$('#tb_pagination').twbsPagination({
		totalPages: 1,
        visiblePages: visiblePages,
        first: $.i18n.prop('pagination_first'),
        prev: $.i18n.prop('pagination_prev'),
        next: $.i18n.prop('pagination_next'),
        last: $.i18n.prop('pagination_last'),
        onPageClick: function (event, page) {
            var curpage = parseInt(page);
            var param={};
        	param.level = $('#loglevel').val();
        	var s = $('#datetimepicker1').data("DateTimePicker").date();
        	var n = $('#datetimepicker2').data("DateTimePicker").date();
        	param.startDate = s.format();
        	param.endDate = n.format();
        	param.numPrePage = numPrePage;
        	param.curpage = curpage;
        	var dataParam = {
        		    url: rootPath + "/system/syslog/logs",
        			param:param,
        			call: function(data) {
        				if(data!=null && data.logs!=null) {
        						var html = '';
        						for( var i in data.logs){
        							var log = data.logs[i];
        							html += "<tr>";
        							html += "<td>"+log.id+"</td>";
        							html += "<td>"+$.i18n.prop('loglevel_'+log.level)+"</td>";
        							html += "<td>"+log.date+"</td>";
        							html += "<td>"+log.content+"</td>";
        							html += "<td>"+((log.user===undefined||log.user===null)?'-':log.user)+"</td>";
        							html += "<td>"+((log.ipaddr===null || log.ipaddr===null)?"-":log.ipaddr)+"</td>";
        						}
        						$('#logs tbody').html(html);
        					}					
        				}
        	};
        	getAjaxData(dataParam,false);
        }
    });

	$('#loglevel').change(fillData);
	$('#numPrePage').change(fillData);
	$('#query').click(fillData);
});

var visiblePages = 7;
var numPrePage = 15;

function fillData(){
	
	numPrePage = parseInt($('#numPrePage').val());
	var param={};
	param.level = $('#loglevel').val();
	var s = $('#datetimepicker1').data("DateTimePicker").date();
	var n = $('#datetimepicker2').data("DateTimePicker").date();
	param.startDate = s.format();
	param.endDate = n.format();
	var dataParam = {
		    url: rootPath + "/system/syslog/count",
			param:param,
			call: function(data) {
				if(data!=null) {						
						var count = parseInt(data.count);
						var pages = Math.ceil(count/numPrePage);
						if( pages == 0 )
							pages = 1;
						$('#tb_pagination').twbsPagination({
					        totalPages: pages,
					        visiblePages: visiblePages
					    });
					}					
				}
	};
	getAjaxData(dataParam,false);
}