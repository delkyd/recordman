<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	
	<div class="modal fade" id="waveModal" role="dialog">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <ul class="waveMenu" >
			    <li><button class="btn btn-default" onclick="wave_selectChls()"><fmt:message key="wave_menu_selectchl" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_hdr()"><fmt:message key="wave-hdr" bundle="${bundle }"/></button></li>
			    <li class="menu_separator"></li>
			    <li><button class="btn btn-default" onclick="wave_hzoom(true)"><fmt:message key="wave_menu_hzoomin" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_hzoom(false)"><fmt:message key="wave_menu_hzoomout" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_vzoom(true)"><fmt:message key="wave_menu_vzoomin" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_vzoom(false)"><fmt:message key="wave_menu_vzoomout" bundle="${bundle }"/></button></li>
			    <li class="menu_separator"></li>
			    <li><button class="btn btn-default" onclick="wave_vector()"><fmt:message key="wave_menu_vector" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_harmonic()"><fmt:message key="wave_menu_harmonic" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="wave_impedance()"><fmt:message key="wave_menu_impedance" bundle="${bundle }"/></button></li>
			    <li class="menu_separator"></li>
			    <li><button class="btn btn-default" onclick="printComtrade()"><fmt:message key="wave_menu_print" bundle="${bundle }"/></button></li>
			    <li><button class="btn btn-default" onclick="exportComtrade()"><fmt:message key="wave_menu_download" bundle="${bundle }"/></button></li>
			</ul>
			<div id='wave-graph' ondragstart="return false;" onmousedown="return false;"></div>
	      </div>
	    </div>
	  </div>
	</div>
	
	<div class="modal fade" id="waveHdrModal"  role="dialog" data-backdrop="false">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h4 class="modal-title"><fmt:message key="wave-hdr" bundle="${bundle }"/></h4>
	      </div>
			<div class="modal-body">
				<div id='wave-hdr' class='scroll'>
					<div class="alert alert-danger" role="alert"></div>
					<div></div>
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
			<div class="modal-footer">
	        <button type="button" class="btn btn-default" id="cancel" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	        </div>
	    </div>
	  </div>
	</div>
	
	<div class="modal fade" id="waveSelChlModal"  role="dialog" data-backdrop="false">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h4 class="modal-title"><fmt:message key="wave_menu_selectchl" bundle="${bundle }"/></h4>
	      </div>
			<div class="modal-body container-fluid">
				<div class="row">
					<div class="col-md-5">
						<table class="table table-head">
							<thead>
								<tr>
									<th ><fmt:message key="channel_th_show" bundle="${bundle }" /></th>
									<th ><fmt:message key="channel_th_name" bundle="${bundle }" /></th>
									<th ><fmt:message key="channel_th_phase" bundle="${bundle }" /></th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="col-md-offset-1 col-md-5">
						<table class="table table-head">
							<thead>
								<tr>
									<th ><fmt:message key="channel_th_show" bundle="${bundle }" /></th>
									<th ><fmt:message key="channel_th_name" bundle="${bundle }" /></th>
									<th ><fmt:message key="channel_th_changed" bundle="${bundle }" /></th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="col-md-5 scroll">
						<table id='aichlsTb' class="table table-condensed table-hover table-striped">
							<tbody class="">
							</tbody>
						</table>					
					</div>
					<div class="col-md-offset-1 col-md-5 scroll">
						<table id='dichlsTb' class="table table-condensed table-hover table-striped">
							<tbody class="">
							</tbody>
						</table>
					</div>
					<div class="col-md-5">
						<button type="button" class="btn btn-default" onclick="filterchl_sel_all_ai()"><fmt:message key="chlfilter_selectall" bundle="${bundle }"/></button>
						<button type="button" class="btn btn-default" onclick="filterchl_desel_all_ai()"><fmt:message key="chlfilter_deselectall" bundle="${bundle }"/></button>
					</div>
					<div class="col-md-offset-1 col-md-5">
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
	        	<button type="button" onclick="closeDialog(event,closeHarmonicDlg)" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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
	        	<button type="button" onclick="closeDialog(event,closeHarmonicDlg)" class="btn btn-default" id="cancel" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	    	</div>
	   </div>
	  </div>
	</div>
	
	<div class="nomodal" id="ImpedanceDialog"  role="dialog">
	  <div class="nomodal-dialog">
	    <div class="nomodal-content">
	     	<div class="nomodal-header">
	        	<button type="button" onclick="closeDialog(event)" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        	<h4 class="nomodal-title"><fmt:message key="wave_menu_impedance" bundle="${bundle }"/></h4>
	     	</div>
		  	<div class="nomodal-body">
		  		<div>
		  			<div class="">
						<form class="container-fluid">
							<div class="row">
							<div class="col-md-4 form-group">
								<label for="imp_ia" class="control-label">Ia</label>
							    <select class="form-control" id="imp_ia" ></select>
							</div>
							<div class="col-md-4 form-group">
								<label for="imp_ib" class="control-label">Ib</label>
							    <select class="form-control" id="imp_ib" ></select>
							</div>
							<div class="col-md-4 form-group">
								<label for="imp_ic" class="control-label">Ic</label>
							    <select class="form-control" id="imp_ic" ></select>
							</div>
							</div>
							<div class="row">
							<div class="col-md-4 form-group">
								<label for="imp_ua" class="control-label">Ua</label>
							    <select class="form-control" id="imp_ua" ></select>
							</div>
							<div class="col-md-4 form-group">
								<label for="imp_ub" class="control-label">Ub</label>
							    <select class="form-control" id="imp_ub" ></select>
							</div>
							<div class="col-md-4 form-group">
								<label for="imp_uc" class="control-label">Uc</label>
							    <select class="form-control" id="imp_uc" ></select>
							</div>
							</div>
							<div class="row">
							<div class="col-md-2 form-group">
								<label for="startCyc" class="control-label">起始周波</label>
							    <select class="form-control" id="startCyc" ></select>
							</div>
							<div class="col-md-2 form-group">
								<label for="endCyc" class="control-label">结束周波</label>
							    <select class="form-control" id="endCyc" ></select>
							</div>
							<div class="col-md-2 form-group">
								<label for="startCyc" class="control-label">零序补偿系数kr</label>
							    <input type='text' class="form-control" id="kr" value='0'></input>
							</div>
							<div class="col-md-2 form-group">
								<label for="kx" class="control-label">零序补偿系数kx</label>
							    <input type='text'  class="form-control" id="kx" value='0'></input>
							</div>
							<div class="col-md-2 form-group radiogroup">
								<div class="radio">
								  <label>
								    <input type="radio" name="impPhaseRadios" id="impPhaseRadios1" checked value="1">
								   	 单相
								  </label>
								</div>
								<div class="radio">
								  <label>
								    <input type="radio" name="impPhaseRadios" id="impPhaseRadios2" value="2">
								   	 相间
								  </label>
								</div>
							</div>
							<div class="col-md-2 form-group radiogroup">
								<div class="radio">
								  <label>
								    <input type="radio" name="impTypeRadios" id="impTypeRadios1" checked value="1">
								   	 幅值
								  </label>
								</div>
								<div class="radio">
								  <label>
								    <input type="radio" name="impTypeRadios" id="impTypeRadios2" value="2">
								   	 相角
								  </label>
								</div>
							</div>
							</div>
						</form>
					</div>
					<div class="Impedance-graph">
						
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
	