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
	        <ul class="nav nav-tabs" role="tablist">
			    <li role="presentation" class="active"><a href="#wave-graph" aria-controls="wave-graph" role="tab" data-toggle="tab"><fmt:message key="wave-graph" bundle="${bundle }"/></a></li>
			    <li role="presentation"><a href="#wave-hdr" aria-controls="wave-hdr" role="tab" data-toggle="tab"><fmt:message key="wave-hdr" bundle="${bundle }"/></a></li>
			</ul>
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id='wave-graph' ondragstart="return false;" onmousedown="return false;"></div>
				<div role="tabpanel" class="tab-pane" id="wave-hdr" >
					<div class="alert alert-danger" role="alert"></div>
					<div class="panel panel-zero">
						<div class="panel-heading"><fmt:message key="hdr-overview" bundle="${bundle }"/></div>
						<table id="waveModal_breifTb" class="table table-striped">
							<tbody></tbody>
						</table>
					</div>
			
					<div class="panel panel-success">
						<div class="panel-heading"><fmt:message key="hdr-fault" bundle="${bundle }"/></div>
						<table id="waveModal_faultinfoTb" class="table table-striped">
							<tbody></tbody>
						</table>
					</div>
			
					<div class="panel panel-info">
						<div class="panel-heading"><fmt:message key="hdr-action" bundle="${bundle }"/></div>
						<table id="waveModal_tripinfoTb" class="table table-striped">
							<thead>
								<tr>
									<th width="15%"><fmt:message key="time" bundle="${bundle }"/></th>
									<th width="20%"><fmt:message key="name" bundle="${bundle }"/></th>
									<th width="10%"><fmt:message key="value" bundle="${bundle }"/></th>
									<th width="10%"><fmt:message key="phase" bundle="${bundle }"/></th>
									<th width="45%"><fmt:message key="faultinfo" bundle="${bundle }"/></th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
			
					<div class="panel panel-warning">
						<div class="panel-heading"><fmt:message key="hdr-diBeforeFault" bundle="${bundle }"/></div>
						<table id="waveModal_distatusTb" class="table table-striped">
							<tbody></tbody>
						</table>
					</div>
			
					<div class="panel panel-danger">
						<div class="panel-heading"><fmt:message key="hdr-distatus" bundle="${bundle }"/></div>
						<table id="waveModal_dieventTb" class="table table-striped">
							<thead>
								<tr>
									<th width="15%"><fmt:message key="time" bundle="${bundle }"/></th>
									<th width="20%"><fmt:message key="name" bundle="${bundle }"/></th>
									<th width="20%"><fmt:message key="value" bundle="${bundle }"/></th>
									<th width="45%"></th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
			
					<div class="panel panel-primary">
						<div class="panel-heading"><fmt:message key="hdr-setting" bundle="${bundle }"/></div>
						<table id="waveModal_settingTb" class="table table-striped">
							<tbody></tbody>
						</table>
					</div>
				</div>
	      	</div>
	      </div>
	    </div>
	  </div>
	</div>
<script src="<%=request.getContextPath()%>/resources/js/jquery-1.11.3.min.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/jquery.i18n.properties-min-1.0.9.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/bootstrap.min.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/jscomtrade.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/public.js"></script>