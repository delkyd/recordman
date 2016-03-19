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
				<div class="conf-container ">
					<div class='onepage'>
						<div class="formstyle form-inline ">
							<div class='form-group'>
								<label class="control-label"><fmt:message key="stgroup" bundle="${bundle }"/></label>
								<select id='stgroups' class="form-control">									
								</select>
								<button class='customBtn createBtn' onclick='createStgroup()' title='<fmt:message key="create" bundle="${bundle }"/>'></button>
								<button class='customBtn editBtn' onclick='editStgroup()' title='<fmt:message key="edit" bundle="${bundle }"/>'></button>
								<button class='customBtn deleteBtn' onclick='deleteStgroup()' title='<fmt:message key="delete" bundle="${bundle }"/>'></button>
							</div>													
						</div>
						<div class="formstyle table-responsive ">
							<table id='settings' class="table table-condensed table-hover">
								<caption><span><fmt:message key="setting" bundle="${bundle }"/></span><button class='customBtn createBtn' title='<fmt:message key="create" bundle="${bundle }"/>' onclick='createSetting()'></button></caption>
								<thead>
									<tr>
										<th><fmt:message key="set_group" bundle="${bundle }"/></th>
										<th><fmt:message key="set_name" bundle="${bundle }"/></th>
										<th><fmt:message key="set_unit" bundle="${bundle }"/></th>
										<th><fmt:message key="set_type" bundle="${bundle }"/></th>
										<th><fmt:message key="set_val" bundle="${bundle }"/></th>
										<th><fmt:message key="set_max" bundle="${bundle }"/></th>
										<th><fmt:message key="set_min" bundle="${bundle }"/></th>
										<th><fmt:message key="set_step" bundle="${bundle }"/></th>
										<th><fmt:message key="set_rate1" bundle="${bundle }"/></th>
										<th><fmt:message key="set_unit1" bundle="${bundle }"/></th>
										<th><fmt:message key="set_rate2" bundle="${bundle }"/></th>
										<th><fmt:message key="set_unit2" bundle="${bundle }"/></th>
										<th></th>
									</tr>
								</thead>
								<tbody >
								</tbody>
							</table>
						</div>
					</div>					
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>
	<div class="modal fade" id="editStgroupModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"><fmt:message key="stgroup" bundle="${bundle }"/></h4>
	      </div>
	      <div class="modal-body">
	        <form>
	        	<input type="hidden" id="stm_stgroup_oldname" value=''/>
	        	<div class="form-group">
	        		<label class="control-label"><fmt:message key="stgroup_name" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="stm_stgroup_name" >
	        	</div>	        	
	        </form>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="btn_cancel" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" id="stm_save"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	
	<div class="modal fade" id="editSettingModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"><fmt:message key="setting" bundle="${bundle }"/></h4>
	      </div>
	      <div class="modal-body">
	        <form class="form-horizontal">
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_group" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<select id='sm_set_group' class="form-control">
						</select>
	        		</div>	        		
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_id" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_id" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_name" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_name" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_unit" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_unit" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_type" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<select id='sm_set_type' class="form-control">
							<option value='Bool'>Bool</option>
							<option value='Float'>Float</option>
							<option value='Int'>Int</option>
							<option value='Uint'>Uint</option>
						</select>
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_val" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_val" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_max" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_max" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_min" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_min" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_step" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_step" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_rate1" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_rate1" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_unit1" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_unit1" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_rate2" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_rate2" >
	        		</div>
	        	</div>
	        	<div class="form-group">
	        		<label class="col-sm-3 control-label"><fmt:message key="set_unit2" bundle="${bundle }"/></label>
	        		<div class="col-sm-9">
	        			<input type="text" class="form-control" id="sm_set_unit2" >
	        		</div>
	        	</div>
	        </form>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="btn_cancel" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" id="sm_save"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/settings.js"></script>
</body>
</html>