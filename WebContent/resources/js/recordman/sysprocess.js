$(function(){
	setNavActive('nav_sys');
	var w = $('.chartsDiv').width();
	var size = (w - (4*21))/3;
	if( size > minSize ){
		chartSize = size;
	}else if( w < minSize ){
		chartSize = w;
	}
	setCpuChart();
	setMemoryChart();
	setDiskChart();
	
	update();
});

function update(){
	var param={};
	var dataParam = {
		    url: rootPath + "/system/sysprocess/curstatus",
			param:param,
			call: function(data) {
				if(data!=null) {						
					updateCpuChart(data.cpu);
					updateMemoryChart(data.memory);
					updateDiskChart(data.disk);
					fillTable(data.process)
					}					
				}
	};
	getAjaxData(dataParam,false);
}

var minSize=200;
var chartSize=minSize;

function setCpuChart(){
	$('#cpu').highcharts({
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            width:chartSize,
            height:chartSize
        },

        title: {
            text: $.i18n.prop('cpu_usage')
        },
        
        credits: {
            enabled: false
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: '%'
            },
            plotBands: [{
                from: 0,
                to: 30,
                color: '#55BF3B' // green
            }, {
                from: 30,
                to: 70,
                color: '#DDDF0D' // yellow
            }, {
                from: 70,
                to: 100,
                color: '#DF5353' // red
            }]
        },

        series: [{
            name: $.i18n.prop('usage'),
            data: [0],
            tooltip: {
                valueSuffix: '%'
            }
        }]

    },function(){});
}

function updateCpuChart(data){
	var chart = $('#cpu').highcharts();
	chart.series[0].update({
		data: [data.rate]
	});
}

function setMemoryChart(){
	$('#memory').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            width:chartSize,
            height:chartSize
        },
        title: {
            text: $.i18n.prop('memory_usage'),
            align: 'center',
            verticalAlign: 'middle',
            y: 40
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b> MB'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: $.i18n.prop('memory'),
            innerSize: '50%',
            data: [
                [$.i18n.prop('alive'),  0],
                [$.i18n.prop('used'),   0]
            ]
        }]
    });
}

function updateMemoryChart(data){
	var chart = $('#memory').highcharts();
	chart.series[0].update({
		data:[
		      [$.i18n.prop('alive'),  (data.total-data.use)/1024],
		      [$.i18n.prop('used'),   data.use/1024]
		]
	});
}

function setDiskChart(){
	$('#disk').highcharts({
        chart: {
            type: 'column',
            width:chartSize,
            height:chartSize
        },
        title: {
            text: $.i18n.prop('disk_usage')
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            min: 0,
            title: {
                text: $.i18n.prop('disk_volume')+'(GB)'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y} GB<br/>'+$.i18n.prop('total')+': {point.stackTotal} GB'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: $.i18n.prop('alive'),
            data: []
        }, {
            name: $.i18n.prop('used'),
            data: []
        }]
    });
}

function updateDiskChart(data){
	var cates=new Array();
	var alives=new Array();
	var useds=new Array();
	var len = data.partition.length;
	for( var i in data.partition ){
		var p = data.partition[i];
		cates.push(p.mount_name);
		alives.push( Number((p.avail/1024/1024).toFixed(2)) );
		useds.push( Number(((p.size-p.avail)/1024/1024).toFixed(2)) );
	}
	var chart = $('#disk').highcharts();
	chart.xAxis[0].update({
		categories: cates
	});
	chart.series[0].update({
		data:alives
	});
	chart.series[1].update({
		data:useds
	});
}

function fillTable(data){
	var html='';
	if( data != null ){
		for( var i in data ){
			var chl = data[i];
			 html += "<tr id='"+ chl.pid+"'>";
			 html += "<td>"+ chl.name +"</td>";
			 html += "<td>"+ chl.desc +"</td>";
			 html += "<td>"+ chl.start_time +"</td>";
			 html += "<td>"+ chl.cpu_rate +"%</td>";
			 html += "<td>"+ chl.memory_expend/1024 +"MB</td>";
			 if( chl.run_status == 0 ){
				 html += "<td class='offline'>"+ $.i18n.prop('offline') +"</td>";
			 }else{
				 html += "<td >"+ $.i18n.prop('online') +"</td>";
			 }
			 html += "</tr>";
		}
	}
	$('#processes tbody').html(html);
}