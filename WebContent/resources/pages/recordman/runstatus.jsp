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
		<div id="content" class="container-fluid">
			<div class="faq">
				<div class="runstatus-graph">
				  <div class="conclusion"><h2>Everything looks ok</h2></div>
				  <div class="image">
				  	<div class="ethernet eth0">
				  		<div class="icon on"></div>
				  		<div class="name">eth0</div>
				  	</div>
				  	<div class="ethernet eth1">
				  		<div class="icon on"></div>
				  		<div class="name">eth1</div>
				  	</div>
				  	<div class="ethernet eth2">
				  		<div class="icon off"></div>
				  		<div class="name">eth2</div>
				  	</div>
				  	<div class="ethernet eth3">
				  		<div class="icon on"></div>
				  		<div class="name">eth3</div>
				  	</div>
				  	<div class="ethernet eth4">
				  		<div class="icon on"></div>
				  		<div class="name">eth4</div>
				  	</div>
				  	<div class="ethernet eth5">
				  		<div class="icon off"></div>
				  		<div class="name">eth5</div>
				  	</div>
				  </div>
				</div>
				<div class="runstatus-callouts row">
					<div id="overview" class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon light_the_way"></div>
							<div class="title"><fmt:message key="runstatus_title_overview" bundle="${bundle }"/></div>
							<div class="content"></div>
						</div>
					</div>
					<div id="subsystem" class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon plenty_of_room"></div>
							<div class="title"><fmt:message key="runstatus_title_subsystem" bundle="${bundle }"/></div>
							<div class="content"></div>
						</div>
					</div>
					<div id="function" class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon skip_the_crowds"></div>
							<div class="title"><fmt:message key="runstatus_title_function" bundle="${bundle }"/></div>
							<div class="content"></div>
						</div>
					</div>
					<div id="info" class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon byebye_buffering"></div>
							<div class="title"><fmt:message key="runstatus_title_Info" bundle="${bundle }"/></div>
							<div class="content"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script
		src="<%=request.getContextPath()%>/resources/js/recordman/runstatus.js"></script>
</body>
</html>