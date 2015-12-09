<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="mobile-menu slideout-menu">
	<header class="menu-header"></header>
	<section class="menu-section">
		<ul class="menu-section-list">
			<li><a href="<%=request.getContextPath()%>/runstatus/show"><fmt:message key="nav_runstatus" bundle="${bundle }"/></a></li>				
			<li><a href="<%=request.getContextPath()%>/recordfile/show"><fmt:message key="nav_faultrecord" bundle="${bundle }"/></a></li>
			<li class="dropdownmenu">
					<a href="#" class="dropdownmenu-toggle"><fmt:message key="nav_setup" bundle="${bundle }"/> <span class="caret"></span></a>
					<ul class="sub-menu">
						<li><a href="<%=request.getContextPath()%>/devconfig/show"><fmt:message key="nav_setup_dev" bundle="${bundle }"/></a></li>
						<li><a href="<%=request.getContextPath()%>/network/show"><fmt:message key="nav_setup_network" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_setup_primarydev" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_setup_channel" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_setup_setting" bundle="${bundle }"/></a></li>
					</ul>
			</li>
			<li class="dropdownmenu">
					<a href="#" class="dropdownmenu-toggle"><fmt:message key="nav_systemtool" bundle="${bundle }"/> <span class="caret"></span></a>
					<ul class="sub-menu">
						<li><a href=""><fmt:message key="nav_sys_settime" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_sys_setpwd" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_sys_syslog" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_sys_upgrade" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="nav_sys_reboot" bundle="${bundle }"/></a></li>
						<li><a href="<%=request.getContextPath()%>/systest/show">test</a></li>
					</ul>
			</li>
		</ul>
	</section>
</div>