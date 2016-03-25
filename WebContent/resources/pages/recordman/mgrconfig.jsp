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
				<div class="devconfig conf-container">					
					<div class="config left formstyle">
						<h1 class="heading"><fmt:message key="nav_mgr_config" bundle="${bundle }"/></h1>
						<form class="form-horizontal" onsubmit="return false;">
							<section class="cber">
								<header class="blue_bar"><fmt:message key="faultfile_head" bundle="${bundle }"/></header>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="filesavepath" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input id='fault_savepath' type="text" class="form-control" value="${fileconf.fault_path}">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="filesavedays" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input id='fault_savedays' type="number" class="form-control" value="${fileconf.fault_days}">
									</div>
								</div>
							</section>
							<section class="cber">
								<header class="blue_bar"><fmt:message key="continuefile_head" bundle="${bundle }"/></header>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="filesavepath" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input id='contin_savepath' type="text" class="form-control" value="${fileconf.continue_path}">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="filesavedays" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input id='contin_savedays' type="number" class="form-control" value="${fileconf.continue_days}">
									</div>
								</div>
							</section>
							<section class="cber">
								<header class="blue_bar"><fmt:message key="syslog_head" bundle="${bundle }"/></header>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="filesavepath" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input id='log_path' type="text" class="form-control" value="${logconf.path}">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="loglevel" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<select id='log_level' class="form-control">
										<option value="0" <c:if test="${logconf.level==0}">selected</c:if> ><fmt:message key="loglevel_no" bundle="${bundle }"/></option>
										<option value="1" <c:if test="${logconf.level==1}">selected</c:if> ><fmt:message key="loglevel_error" bundle="${bundle }"/></option>
										<option value="2" <c:if test="${logconf.level==2}">selected</c:if> ><fmt:message key="loglevel_warn" bundle="${bundle }"/></option>
										<option value="3" <c:if test="${logconf.level==3}">selected</c:if> ><fmt:message key="loglevel_info" bundle="${bundle }"/></option>
									</select>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label"><fmt:message key="filesavedays" bundle="${bundle }"/></label>
									<div class="col-sm-9">
										<input id='log_days' type="number" class="form-control" value="${logconf.days}">
									</div>
								</div>
							</section>
							
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-block btn-primary" onclick='update()'><fmt:message key="update" bundle="${bundle }"/></button>
							   </div>
							</div>
						</form>
					</div>
					<div class="branding right">
						<span class="log"></span>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/mgrconfig.js"></script>
</body>
</html>