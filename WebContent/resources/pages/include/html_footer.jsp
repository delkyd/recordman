<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="modal fade" id="alertModal" role="dialog">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"></h4>
	      </div>
	      <div class="modal-body">
	        <p id="alertContent"></p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	
	<div class="modal fade" id="confirmModal" >
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h4 class="modal-title"></h4>
	      </div>
	      <div class="modal-body">
	        <p></p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" id="cancel" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-danger" id="confirm"><fmt:message key="confirm" bundle="${bundle }"/></button>
	      </div>
	    </div>
	  </div>
	</div>
	
	<div class="modal fade" id="waveModal" role="dialog">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <ul class="waveMenu" >
	        	
			    <%-- <li><a href="#wave-graph" aria-controls="wave-graph" role="tab" data-toggle="tab"><fmt:message key="wave-graph" bundle="${bundle }"/></a></li> --%>
			    <!-- <li role="presentation"><a href="#wave-hdr" aria-controls="wave-hdr" role="tab" data-toggle="tab"><fmt:message key="wave-hdr" bundle="${bundle }"/></a></li> -->
			    <li><button class="btn btn-default">选择通道</button></li>
			    <li><button class="btn btn-default" onclick="printComtrade()">打印</button></li>
			    <li><button class="btn btn-default" onclick="exportComtrade()">下载</button></li>
			</ul>
			<div id='wave-graph' ondragstart="return false;" onmousedown="return false;"></div>
	      </div>
	    </div>
	  </div>
	</div>
	
	<div class="waitwrap">
		<div class="waitanimation">
			<div class="loader-inner ball-pulse-rise">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	</div>
	
<script src="<%=request.getContextPath()%>/resources/js/jquery-1.11.3.min.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/jquery.i18n.properties-min-1.0.9.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/jquery.mobile.custom.min.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/bootstrap.min.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/jscomtrade.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/public.js"></script>