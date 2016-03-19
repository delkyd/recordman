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
						<div class="formstyle form-inline ">
							<div class='form-group'>
								<label class="control-label"><fmt:message key="line" bundle="${bundle }"/></label>
								<select id='line' class="form-control"></select>
								<button class='customBtn createBtn' onclick='createLine()' title='<fmt:message key="create" bundle="${bundle }"/>'></button>
								<button class='customBtn editBtn' onclick='editLine()' title='<fmt:message key="edit" bundle="${bundle }"/>'></button>
								<button class='customBtn deleteBtn' onclick='deleteLine()' title='<fmt:message key="delete" bundle="${bundle }"/>'></button>
							</div>
						</div>
						<div class="formstyle">							
							<form class="form-horizontal" onsubmit="return false;">
								<h3 class="heading"><fmt:message key="line_param" bundle="${bundle }"/></h3>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_length" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type=text class="form-control" id="line_length" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_ratedcurrent" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_ratedcurrent" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_ratedvoltage" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_ratedvoltage" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_r0" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_r0" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_r1" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_r1" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_r2" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_r2" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_x0" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_x0" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_x1" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_x1" >
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_x2" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="line_x2" >
									</div>
								</div>				
							</form>													
						</div>																								
					</div>
					<div class="right ">
						<div class="formstyle">							
							<form class="form-horizontal" onsubmit="return false;">
								<h3 class="heading"><fmt:message key="line_channel" bundle="${bundle }"/></h3>
								
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_ia" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_ia' class="form-control">
											<c:forEach var="v" items="${currentchannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_ib" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_ib' class="form-control">
											<c:forEach var="v" items="${currentchannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_ic" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_ic' class="form-control">
											<c:forEach var="v" items="${currentchannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_i0" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_i0' class="form-control">
											<c:forEach var="v" items="${currentchannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_ua" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_ua' class="form-control">
											<c:forEach var="v" items="${voltagechannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_ub" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_ub' class="form-control">
											<c:forEach var="v" items="${voltagechannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_uc" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_uc' class="form-control">
											<c:forEach var="v" items="${voltagechannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="line_u0" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='line_u0' class="form-control">
											<c:forEach var="v" items="${voltagechannels}" varStatus="s">
												<option value="${v.id}">${v.name}</option>
											</c:forEach>
										</select>
									</div>
								</div>
								<div class="form-group">
								   <div class="">
								     <button class="btn btn-block btn-primary" onclick='update()'><fmt:message key="update" bundle="${bundle }"/></button>
								   </div>
								</div>
							</form>													
						</div>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>
	<div class="modal fade" id="editLineModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"><fmt:message key="line" bundle="${bundle }"/></h4>
	      </div>
	      <div class="modal-body">
	        <form>
	        	<input type="hidden" id="lm_line_oldname" value=''/>
	        	<div class="form-group">
	        		<label class="control-label"><fmt:message key="line_name" bundle="${bundle }"/></label>
	        		<input type="text" class="form-control" id="lm_line_name" >
	        	</div>	        	
	        </form>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="btn_cancel" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" id="lm_save"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/mgrline.js"></script>
</body>
</html>