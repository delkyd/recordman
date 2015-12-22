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
						<h1 class="heading"><fmt:message key="devconf_heading" bundle="${bundle }"/></h1>
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_stationname" bundle="${bundle }"/></label>
								<div class="">
									<input id='station_name' type="text" class="form-control" >
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_companyname" bundle="${bundle }"/></label>
								<div class="">
									<input id='company_name' type="text" class="form-control" >
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_devname" bundle="${bundle }"/></label>
								<div class="">
									<input id='dev_name' type="text" class="form-control" >
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_serialno" bundle="${bundle }"/></label>
								<div class="">
									<input id='dev_serial' type="text" class="form-control" >
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_devmodel" bundle="${bundle }"/></label>
								<div class="">
									<select id='dev_type' class="form-control">
										<option>Ben5000</option>
										<option>Ben8000</option>
										<option>Ben10086</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_commuprotocol" bundle="${bundle }"/></label>
								<div class="">
									<select id='commu_protocol' class="form-control">
										<option>浙江103</option>
										<option>61850</option>
										<option>Ben10086</option>
									</select>
								</div>
							</div>
							
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-lg btn-block btn-primary">Update</button>
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
	<script src="<%=request.getContextPath()%>/resources/js/recordman/devconfig.js"></script>
</body>
</html>