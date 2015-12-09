<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<header id="nav" class="site-header">
	<nav class="container">
		<div class="mobile-header">
			<button class="btn-hamburger js-slideout-toggle btn-lg">
				<span class="glyphicon glyphicon-menu-hamburger"></span>
			</button>
			<a class="home" href=""><img src="<%=request.getContextPath()%>/resources/images/wave.png" alt="Wave"><fmt:message key="product_name" bundle="${bundle }"/></a>
		</div>
		<div class="desktop-header">		
			<ul>
				<li><a class="home" href=""><img src="<%=request.getContextPath()%>/resources/images/wave.png" alt="Wave"><fmt:message key="product_name" bundle="${bundle }"/></a></li>
				<li id='nav_runstatus'><a href="<%=request.getContextPath()%>/runstatus/show"><fmt:message key="nav_runstatus" bundle="${bundle }"/></a></li>				
				<li id='nav_faultrecord'><a href="<%=request.getContextPath()%>/recordfile/show"><fmt:message key="nav_faultrecord" bundle="${bundle }"/></a></li>
				<li id='nav_setup' class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
						aria-haspopup="true" aria-expanded="true"><fmt:message key="nav_setup" bundle="${bundle }"/><span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a href="<%=request.getContextPath()%>/devconfig/show"><fmt:message key="nav_setup_dev" bundle="${bundle }"/></a></li>
						<li><a href="<%=request.getContextPath()%>/network/show"><fmt:message key="nav_setup_network" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_setup_primarydev" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_setup_channel" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_setup_setting" bundle="${bundle }"/></a></li>
					</ul>
				</li>
				
				<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
						aria-haspopup="true" aria-expanded="true"><fmt:message key="nav_systemtool" bundle="${bundle }"/><span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a href=""><fmt:message key="nav_sys_settime" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_sys_setpwd" bundle="${bundle }"/></a></li>						
						<li><a href=""><fmt:message key="nav_sys_syslog" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_sys_upgrade" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_sys_reboot" bundle="${bundle }"/></a></li>
						<li><a href="<%=request.getContextPath()%>/systest/show">test</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
</header>