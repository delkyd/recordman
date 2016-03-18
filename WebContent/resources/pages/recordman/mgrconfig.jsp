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
							<section class="cber">
								<header class="blue_bar">故障录波文件</header>
								<div class="form-group">
									<label class="control-label"><fmt:message key="devconf_stationname" bundle="${bundle }"/></label>
									<div class="">
										<input id='station_name' type="text" class="form-control" value="${infos.station}">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label"><fmt:message key="devconf_devname" bundle="${bundle }"/></label>
									<div class="">
										<input id='dev_name' type="text" class="form-control" value="${infos.name}">
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
	<script src="<%=request.getContextPath()%>/resources/js/recordman/devconfig.js"></script>
</body>
</html>