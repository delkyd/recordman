<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="mobile-menu slideout-menu">
	<header class="menu-header"></header>
	<section class="menu-section">
		<ul class="menu-section-list">
			<li id="nav_runstatus"><a href="<%=request.getContextPath()%>/runstatus/show"><fmt:message key="runstatus" bundle="${bundle }" /></a></li>
			<li id="nav_setupwizard"><a href=""><fmt:message key="setupwizard" bundle="${bundle }" /></a></li>
			<li id="nav_network"><a href=""><fmt:message key="network" bundle="${bundle }" /></a></li>
			<li id="nav_faultrecord"><a href=""><fmt:message key="faultrecord" bundle="${bundle }" /></a></li>
			<li id="nav_systemtool" class="dropdownmenu">
					<a href="#" class="dropdownmenu-toggle"><fmt:message key="systemtool" bundle="${bundle }"/> <span class="caret"></span></a>
					<ul class="sub-menu">
						<li><a href=""><fmt:message key="settime" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="upgrade" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="setpwd" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="reboot" bundle="${bundle }"/></a></li>
						<li><a href=""><fmt:message key="syslog" bundle="${bundle }"/></a></li>
					</ul>
			</li>
		</ul>
	</section>
</div>