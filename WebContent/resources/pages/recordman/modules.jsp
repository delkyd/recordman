<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<html class="no-js" lang="en">
<head>
<%@ include file="../include/html_head.jsp"%>
</head>
<body>
	<%@ include file="../include/slidemenu.jsp"%>
	<div class="site-wrapper slideout-panel">				
		<%@ include file="../include/nav.jsp"%>	
			<div id="content" class="container-fluid bluebk">
				<div class="modules conf-container editableListgroup">					
					<div class="left modulelist">
						<div class="formstyle">
							<form class="form" onsubmit="return false;">
								<h3 class="heading"><fmt:message key="module_list" bundle="${bundle }"/></h3>
								<div class="form-group">
									<label class=" control-label"><fmt:message key="module_kind" bundle="${bundle }"/></label>
									<div class="">
										<select id='module_kind' class="form-control">
											<option value=''><fmt:message key="all" bundle="${bundle }"/></option>
											<option value='RecSys'><fmt:message key="module_kind_sys" bundle="${bundle }"/></option>
											<option value='RecBus'><fmt:message key="module_kind_bus" bundle="${bundle }"/></option>
											<option value='RecLine'><fmt:message key="module_kind_line" bundle="${bundle }"/></option>
											<option value='RecSwitch'><fmt:message key="module_kind_switch" bundle="${bundle }"/></option>
											<option value='RecAnalog'><fmt:message key="module_kind_analog" bundle="${bundle }"/></option>
										</select>
									</div>
								</div>
							</form>							
							<div class="list-group"></div>
							<button class="btn btn-block btn-primary" onclick='createModule()'><fmt:message key="module_create" bundle="${bundle }"/></button>
						</div>												
					</div>
					<div class="right ">
						<div class="formstyle configs">
							<h3 class="heading"><fmt:message key="module_config" bundle="${bundle }"/></h3>
							<div class="list-group"></div>
							<button class="btn btn-block btn-primary" onclick='createModuleConfig()'><fmt:message key="module_config_create" bundle="${bundle }"/></button>
						</div>
						<div class="formstyle params">
							<h3 class="heading"><fmt:message key="module_param" bundle="${bundle }"/></h3>
							<div class="list-group"></div>
							<button class="btn btn-block btn-primary" onclick='createModuleParam()'><fmt:message key="module_param_create" bundle="${bundle }"/></button>
						</div>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>
	<div class="modal fade" id="editModuleModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"><fmt:message key="module_property" bundle="${bundle }"/></h4>
	      </div>
	      <div class="modal-body">
	        <form>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_id" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_module_id" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_name" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_module_name" >
	        	</div>
	        	<div class="form-group">
					<label class=" control-label"><fmt:message key="module_kind" bundle="${bundle }"/></label>
					<div class="">
						<select id='mm_module_kind' class="form-control">
							<option value='RecSys'><fmt:message key="module_kind_sys" bundle="${bundle }"/></option>
							<option value='RecBus'><fmt:message key="module_kind_bus" bundle="${bundle }"/></option>
							<option value='RecLine'><fmt:message key="module_kind_line" bundle="${bundle }"/></option>
							<option value='RecSwitch'><fmt:message key="module_kind_switch" bundle="${bundle }"/></option>
							<option value='RecAnalog'><fmt:message key="module_kind_analog" bundle="${bundle }"/></option>
						</select>
					</div>
				</div>
	        </form>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="btn_cancel" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" id="mm_save"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	<div class="modal fade" id="editModuleConfigModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"><fmt:message key="module_config" bundle="${bundle }"/></h4>
	      </div>
	      <div class="modal-body">
	        <form>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_id" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_config_id" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_name" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_config_name" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_kind" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_config_kind" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_valType" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_config_valtype" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_val" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_config_val" >
	        	</div>
	        </form>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="btn_cancel" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" id="mm_config_save"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	<div class="modal fade" id="editModuleParamModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"><fmt:message key="module_param" bundle="${bundle }"/></h4>
	      </div>
	      <div class="modal-body">
	        <form>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_id" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_param_id" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_name" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_param_name" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_kind" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_param_kind" >
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_valType" bundle="${bundle }"/></label>
	        		<div class="">
						<select id='mm_param_valtype' class="form-control">
							<option value='Bool'>Bool</option>
							<option value='Float'>Float</option>
							<option value='Int'>Int</option>
							<option value='Uint'>Uint</option>
						</select>
					</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="control-lable"><fmt:message key="module_item_val" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="mm_param_val" >
	        	</div>
	        </form>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="btn_cancel" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" id="mm_param_save"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/modules.js"></script>
</body>
</html>