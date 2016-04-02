$(function(){
	setNavActive('nav_runstatus');
	RefreshStatus();
});

function RefreshStatus(){
	var param={};

	var dataParam = {
			url : rootPath + "/runview/runstatus/all",
			param : param,
			call : function(data){
				if( data && data.runstatus){
					for( var i in data.runstatus ){
						var obj = data.runstatus[i];
						switch( obj.name ){
						case 'System':
							{
							updateOverview(obj);
							break;
							}
						case 'SubSystem':
							{
							updateSubsystem(obj);
							break;
							}
						case 'Function':
							{
							updateFunction(obj);
							break;
							}
						case 'Info':
							{
							updateInfo(obj);
							break;
							}
						}
					}
				}
			}
	};
	getAjaxData(dataParam);
}

function updateOverview(data){
	if( data == null )
		return;
	var html='';
	if( !(data.runstatus === undefined)  ){
		switch( data.runstatus ){
		case CONST.RUNSTATUS.QUIT:
			{
				html += "<span class='error'>" + $.i18n.prop('runstatus_overview_status') + ":" + $.i18n.prop('runstatus_quit') + "</span>";
				if( data.time ){
					html += "<span>" + $.i18n.prop('runstatus_overview_quittime') + ":" + data.time + "</span>";
				}
				break;
			}
		case CONST.RUNSTATUS.RUN:
			{
				html += "<span>" + $.i18n.prop('runstatus_overview_status') + ":" + $.i18n.prop('runstatus_run') + "</span>";
				if( data.time ){
					html += "<span>" + $.i18n.prop('runstatus_overview_starttime') + ":" + data.time + "</span>";
				}
				if( data.runtime ){
					html += "<span>" + $.i18n.prop('runstatus_overview_runtime') + ":" + data.runtime + "</span>";
				}
				break;
			}
		default:
			{
				html += "<span class='unknown'>" + $.i18n.prop('runstatus_overview_status') + ":" + $.i18n.prop('status_unknown') + "</span>";
				break;
			}
		}
	}
	if( !(data.time_sync === undefined ) ){
		switch( data.time_sync ){
		case CONST.TIMESYNC.DESYNC:
			{
			html += "<span class='error'>" + $.i18n.prop('runstatus_overview_timesync') + ":" + $.i18n.prop('runstatus_time_desync') + "</span>";
			break;
			}
		case CONST.TIMESYNC.SYNC:
			{
			html += "<span>" + $.i18n.prop('runstatus_overview_timesync') + ":" + $.i18n.prop('runstatus_time_sync') + "</span>";
			break;
			}
		default:
			{
				html += "<span class='unknown'>" + $.i18n.prop('runstatus_overview_timesync') + ":" + $.i18n.prop('status_unknown') + "</span>";
			}
		}
	}
	$('#overview .content').html(html);
}

function updateSubsystem(data){
	if( data == null )
		return;
	var html='';
	if( !(data.ipc === undefined)  ){
		switch( data.ipc ){
		case CONST.RUNSTATUS.RUN:
		{
			html += "<span>" + $.i18n.prop('runstatus_subsys_ipc') + ":" + $.i18n.prop('runstatus_ok') + "</span>";
			break;
		}
		case CONST.RUNSTATUS.QUIT:
		{
			html += "<span class='error'>" + $.i18n.prop('runstatus_subsys_ipc') + ":" + $.i18n.prop('runstatus_error') + "</span>";
			break;
		}
		default:
		{
			html += "<span class='unknown'>" + $.i18n.prop('runstatus_subsys_ipc') + ":" + $.i18n.prop('status_unknown') + "</span>";
			break;
		}

		}
	}
	if( !(data.trigger_record === undefined)  ){
		switch( data.trigger_record ){
		case CONST.RUNSTATUS.RUN:
		{
			html += "<span>" + $.i18n.prop('runstatus_subsys_trigger') + ":" + $.i18n.prop('runstatus_ok') + "</span>";
			break;
		}
		case CONST.RUNSTATUS.QUIT:
		{
			html += "<span class='error'>" + $.i18n.prop('runstatus_subsys_trigger') + ":" + $.i18n.prop('runstatus_error') + "</span>";
			break;
		}
		default:
		{
			html += "<span class='unknown'>" + $.i18n.prop('runstatus_subsys_trigger') + ":" + $.i18n.prop('status_unknown') + "</span>";
			break;
		}

		}
	}
	if( !(data.continue_record === undefined)  ){
		switch( data.continue_record ){
		case CONST.RUNSTATUS.RUN:
		{
			html += "<span>" + $.i18n.prop('runstatus_subsys_continue') + ":" + $.i18n.prop('runstatus_ok') + "</span>";
			break;
		}
		case CONST.RUNSTATUS.QUIT:
		{
			html += "<span class='error'>" + $.i18n.prop('runstatus_subsys_continue') + ":" + $.i18n.prop('runstatus_error') + "</span>";
			break;
		}
		default:
		{
			html += "<span class='unknown'>" + $.i18n.prop('runstatus_subsys_continue') + ":" + $.i18n.prop('status_unknown') + "</span>";
			break;
		}

		}
	}
	if( !(data.collectors === undefined)  ){
		for( var i = 0; i < data.collectors.length; i++ ){
			var r = data.collectors[i];
			switch( r ){
			case CONST.RUNSTATUS.RUN:
			{
				html += "<span>" + $.i18n.prop('runstatus_subsys_gather') + (parseInt(i)+1) + ":" + $.i18n.prop('runstatus_ok') + "</span>";
				break;
			}
			case CONST.RUNSTATUS.QUIT:
			{
				html += "<span class='error'>" + $.i18n.prop('runstatus_subsys_gather') + (parseInt(i)+1) + ":" + $.i18n.prop('runstatus_error') + "</span>";
				break;
			}
			default:
			{
				html += "<span class='unknown'>" + $.i18n.prop('runstatus_subsys_gather') + (parseInt(i)+1) + ":" + $.i18n.prop('status_unknown') + "</span>";
				break;
			}

			}
		}
	}

	$('#subsystem .content').html(html);
}

function updateFunction(data){
	if( data == null )
		return;
	var html='';
	if( !(data.file_count === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_func_filecount') + ":" + data.file_count + "</span>";
	}else{
		html += "<span>" + $.i18n.prop('runstatus_func_filecount') + ":" + 0 + "</span>";
	}
	if( !(data.last_file === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_func_lastfile') + ":" + data.last_file + "</span>";
	}
	if( !(data.last_time === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_func_lasttime') + ":" + data.last_time + "</span>";
	}
	if( !(data.ethernets === undefined)  ){
		for( var i = 0; i < data.ethernets.length; i++ ){
			var r = data.ethernets[i];
			switch( r ){
			case CONST.RUNSTATUS.RUN:
			{
				html += "<span>" + $.i18n.prop('runstatus_func_eth') + parseInt(i) + ":" + $.i18n.prop('runstatus_ok') + "</span>";
				break;
			}
			case CONST.RUNSTATUS.QUIT:
			{
				html += "<span class='error'>" + $.i18n.prop('runstatus_func_eth') + parseInt(i) + ":" + $.i18n.prop('runstatus_error') + "</span>";
				break;
			}
			default:
			{
				html += "<span class='unknown'>" + $.i18n.prop('runstatus_func_eth') + parseInt(i) + ":" + $.i18n.prop('status_unknown') + "</span>";
				break;
			}

			}
		}
	}

	$('#function .content').html(html);
}

function updateInfo(data){
	if( data == null )
		return;
	var html='';
	if( !(data.station === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_info_station') + ":" + data.station + "</span>";
	}
	if( !(data.devname === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_info_devname') + ":" + data.devname + "</span>";
	}
	if( !(data.devmodel === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_info_devmodel') + ":" + data.devmodel + "</span>";
	}
	if( !(data.software_version === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_info_swver') + ":" + data.software_version + "</span>";
	}
	if( !(data.hardware_version === undefined)  ){
		html += "<span>" + $.i18n.prop('runstatus_info_hwver') + ":" + data.hardware_version + "</span>";
	}

	$('#info .content').html(html);
}
