<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	
	<div class="modal fade" id="waveModal" role="dialog">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <ul class="waveMenu" >
			    <li><button class="btn btn-default" onclick="wave_selectChls()"><fmt:message key="wave_menu_selectchl" bundle="${bundle }"/></button></li>
			    <li class="menu_separator"></li>
			    <li><button class="btn btn-default" onclick="wave_hzoom(true)"><fmt:message key="wave_menu_hzoomin" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_hzoom(false)"><fmt:message key="wave_menu_hzoomout" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_vzoom(true)"><fmt:message key="wave_menu_vzoomin" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_vzoom(false)"><fmt:message key="wave_menu_vzoomout" bundle="${bundle }"/></button></li>
			    <li class="menu_separator"></li>
			    <li><button class="btn btn-default" onclick="wave_vector()"><fmt:message key="wave_menu_vector" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_harmonic()"><fmt:message key="wave_menu_harmonic" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default"><fmt:message key="wave_menu_impedance" bundle="${bundle }"/></button></li>
			    <li class="menu_separator"></li>
			    <li><button class="btn btn-default" onclick="printComtrade()"><fmt:message key="wave_menu_print" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="exportComtrade()"><fmt:message key="wave_menu_download" bundle="${bundle }"/></button></li>
			</ul>
			<div id='wave-graph' ondragstart="return false;" onmousedown="return false;"></div>
	      </div>
	    </div>
	  </div>
	</div>
	
	<div class="modal fade" id="waveSelChlModal"  role="dialog">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h4 class="modal-title"><fmt:message key="wave_menu_selectchl" bundle="${bundle }"/></h4>
	      </div>
			<div class="modal-body container-fluid">
				<div class="row">
					<div class="col-md-6">
						<table class="table table-head">
							<thead>
								<tr>
									<th width="28%"><fmt:message key="channel_th_show" bundle="${bundle }" /></th>
									<th width="48%"><fmt:message key="channel_th_name" bundle="${bundle }" /></th>
									<th width="24%"><fmt:message key="channel_th_phase" bundle="${bundle }" /></th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="col-md-6">
						<table class="table table-head">
							<thead>
								<tr>
									<th width="28%"><fmt:message key="channel_th_show" bundle="${bundle }" /></th>
									<th width="48%"><fmt:message key="channel_th_name" bundle="${bundle }" /></th>
									<th width="24%"><fmt:message key="channel_th_changed" bundle="${bundle }" /></th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="col-md-6 scroll">
						<table id='aichlsTb' class="table table-condensed table-hover table-striped">
							<tbody class="">
							</tbody>
						</table>					
					</div>
					<div class="col-md-6 scroll">
						<table id='dichlsTb' class="table table-condensed table-hover table-striped">
							<tbody class="">
							</tbody>
						</table>
					</div>
					<div class="col-md-6">
						<button type="button" class="btn btn-default" onclick="filterchl_sel_all_ai()"><fmt:message key="chlfilter_selectall" bundle="${bundle }"/></button>
						<button type="button" class="btn btn-default" onclick="filterchl_desel_all_ai()"><fmt:message key="chlfilter_deselectall" bundle="${bundle }"/></button>
					</div>
					<div class="col-md-6">
						<button type="button" class="btn btn-default" onclick="filterchl_sel_all_di()"><fmt:message key="chlfilter_selectall" bundle="${bundle }"/></button>
						<button type="button" class="btn btn-default" onclick="filterchl_desel_all_di()"><fmt:message key="chlfilter_deselectall" bundle="${bundle }"/></button>
						<button type="button" class="btn btn-default" onclick="filterchl_sel_changed_di()"><fmt:message key="chlfilter_selectchanged" bundle="${bundle }"/></button>
					</div>
				</div>								
			</div>			
			<div class="modal-footer">
	        <button type="button" class="btn btn-default" id="cancel" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" onclick="filterchl_ok()" id="confirm"><fmt:message key="confirm" bundle="${bundle }"/></button>
	      	</div>
	    </div>
	  </div>
	</div>
	
	<div class="nomodal" id="vectorDialog"  role="dialog">
	  <div class="nomodal-dialog">
	    <div class="nomodal-content">
	     	<div class="nomodal-header">
	        	<button type="button" onclick="closeDialog(event,closeVectorDlg)" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="nomodal-title"><fmt:message key="wave_menu_vector" bundle="${bundle }"/></h4>
	        	<span><fmt:message key="wavevector_tip" bundle="${bundle }"/></span>
	     	</div>
		  	<div class="nomodal-body container-fluid">
		  		<div class="row">
		  			<div class="col-md-5">
		  				<table class="table table-head">
							<thead>
								<th width="48%"><fmt:message key="channel_th_name" bundle="${bundle }" /></th>
								<th width="28%"><fmt:message key="wavevector_angle" bundle="${bundle }"/></th>
								<th width="24%"><fmt:message key="wavevector_amp" bundle="${bundle }"/></th>
							</thead>
						</table>
		  			</div>
		  		</div>
		  		<div class="row">
		  			<div class="col-md-5 scroll">
						<table class="table table-condensed table-hover table-striped">
							<tbody>
								
							</tbody>
						</table>
					</div>
					<div class="col-md-7 vector-graph">
						
					</div>
		  		</div>
		  	</div>
			<div class="nomodal-footer">
	        	<button type="button" onclick="closeDialog(event,closeVectorDlg)" class="btn btn-default" id="cancel" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	    	</div>
	   </div>
	  </div>
	</div>
	
	<div class="nomodal" id="harmonicDialog"  role="dialog">
	  <div class="nomodal-dialog">
	    <div class="nomodal-content">
	     	<div class="nomodal-header">
	        	<button type="button" onclick="closeDialog(event)" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="nomodal-title"><fmt:message key="wave_menu_harmonic" bundle="${bundle }"/></h4>
	        	<span><fmt:message key="waveharmonic_tip" bundle="${bundle }"/></span>
	     	</div>
		  	<div class="nomodal-body container-fluid">
		  		<div class="row">
		  			<div class="col-md-5 scroll">
						<table class="table table-condensed table-hover table-striped">
							<tbody>
								
							</tbody>
						</table>
					</div>
					<div class="col-md-7 harmonic-graph">
						
					</div>
		  		</div>
		  	</div>
			<div class="nomodal-footer">
	        	<button type="button" onclick="closeDialog(event)" class="btn btn-default" id="cancel" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	    	</div>
	   </div>
	  </div>
	</div>
	<script src="<%=request.getContextPath()%>/resources/js/math.min.js"></script>
	