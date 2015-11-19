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
	
	//$('#waveModal_hdrContent').hide();
	$('#waveModal').modal('show');
}
