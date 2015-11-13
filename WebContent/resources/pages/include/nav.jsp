<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<header class="site-header">
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
			<li><a href="<%=request.getContextPath()%>/runstatus/show"><fmt:message key="runstatus" bundle="${bundle }"/></a></li>
			<li><a href=""><fmt:message key="setupwizard" bundle="${bundle }"/></a></li>
			<li><a href=""><fmt:message key="network" bundle="${bundle }"/></a></li>
			<li><a href=""><fmt:message key="faultrecord" bundle="${bundle }"/></a></li>
			<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
					aria-haspopup="true" aria-expanded="false"><fmt:message key="systemtool" bundle="${bundle }"/><span class="caret"></span></a>
				<ul class="dropdown-menu" id="dropdown">
					<li><a href=""><fmt:message key="settime" bundle="${bundle }"/></a></li>
					<li><a href=""><fmt:message key="upgrade" bundle="${bundle }"/></a></li>
					<li><a href=""><fmt:message key="setpwd" bundle="${bundle }"/></a></li>
					<li><a href=""><fmt:message key="reboot" bundle="${bundle }"/></a></li>
					<li><a href=""><fmt:message key="syslog" bundle="${bundle }"/></a></li>
				</ul>
			</li></ul>
		</div>
	</nav>
</header>