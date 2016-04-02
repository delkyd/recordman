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
			<c:if test="${empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>/resources/pages/login.jsp"><fmt:message key="login" bundle="${bundle }"/></a>
				<span class="loginItem"><fmt:message key="welcome" bundle="${bundle }"/><fmt:message key="user_guest" bundle="${bundle }"/></span>
			</c:if>
			<c:if test="${!empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>/resources/pages/login.jsp"><fmt:message key="logout" bundle="${bundle }"/></a>
				<c:if test="${user.type==2}">
					<span class="loginItem"><fmt:message key="welcome" bundle="${bundle }"/><fmt:message key="user_admin" bundle="${bundle }"/></span>
				</c:if>
				<c:if test="${user.type==3}">
					<span class="loginItem"><fmt:message key="welcome" bundle="${bundle }"/><fmt:message key="user_engineer" bundle="${bundle }"/></span>
				</c:if>
			</c:if>
		</div>
		<div class="desktop-header">		
			<ul>
				<li><a class="home" href=""><img src="<%=request.getContextPath()%>/resources/images/wave.png" alt="Wave"><fmt:message key="product_name" bundle="${bundle }"/></a></li>
				<c:if test="${empty user}">
					<li id='nav_runstatus'><a href="<%=request.getContextPath()%>/runview/runstatus/"><fmt:message key="nav_runstatus" bundle="${bundle }"/></a></li>				
					<li id='nav_faultrecord'><a href="<%=request.getContextPath()%>/runview/recordfile/"><fmt:message key="nav_faultrecord" bundle="${bundle }"/></a></li>
				</c:if>
				<c:if test="${!empty user && user.type==2}">
					<li><a href="<%=request.getContextPath()%>/devparam/devconfig/"><fmt:message key="nav_setup_dev" bundle="${bundle }"/></a></li>							
					<li><a href="<%=request.getContextPath()%>/devparam/settingval/"><fmt:message key="nav_setup_setting" bundle="${bundle }"/></a></li>
					<li><a href="<%=request.getContextPath()%>/devparam/line/"><fmt:message key="nav_mgr_Line" bundle="${bundle }"/></a></li>							
				</c:if>
				<c:if test="${!empty user && user.type>=3}">						
					<li><a href="<%=request.getContextPath()%>/mgrparam/channels/"><fmt:message key="nav_dfu_channel" bundle="${bundle }"/></a></li>
					<li><a href="<%=request.getContextPath()%>/mgrparam/modules/"><fmt:message key="nav_dfu_modules" bundle="${bundle }"/></a></li>						
					<li><a href="<%=request.getContextPath()%>/mgrparam/settings/"><fmt:message key="nav_dfu_setting" bundle="${bundle }"/></a></li>
					<li><a href="<%=request.getContextPath()%>/mgrparam/dfuapply/"><fmt:message key="nav_dfu_apply" bundle="${bundle }"/></a></li>
					<li><a href="<%=request.getContextPath()%>/mgrparam/mgrconfig/"><fmt:message key="nav_mgr_config" bundle="${bundle }"/></a></li>				
				</c:if>
				<c:if test="${!empty user}">				
					<li id='nav_sys' class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
						aria-haspopup="true" aria-expanded="true"><fmt:message key="nav_systemtool" bundle="${bundle }"/><span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="<%=request.getContextPath()%>/system/systime/"><fmt:message key="nav_sys_settime" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/system/syspwd/"><fmt:message key="nav_sys_setpwd" bundle="${bundle }"/></a></li>						
							<li><a href="<%=request.getContextPath()%>/system/syslog/"><fmt:message key="nav_sys_syslog" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/system/sysreboot/"><fmt:message key="nav_sys_reboot" bundle="${bundle }"/></a></li>
						</ul>
					</li>
				</c:if>				
			</ul>
			<c:if test="${empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>/resources/pages/login.jsp"><fmt:message key="login" bundle="${bundle }"/></a>
				<span class="loginItem"><fmt:message key="welcome" bundle="${bundle }"/><fmt:message key="user_guest" bundle="${bundle }"/></span>
			</c:if>
			<c:if test="${!empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>/resources/pages/login.jsp"><fmt:message key="logout" bundle="${bundle }"/></a>
				<c:if test="${user.type==2}">
					<span class="loginItem"><fmt:message key="welcome" bundle="${bundle }"/><fmt:message key="user_admin" bundle="${bundle }"/></span>
				</c:if>
				<c:if test="${user.type==3}">
					<span class="loginItem"><fmt:message key="welcome" bundle="${bundle }"/><fmt:message key="user_engineer" bundle="${bundle }"/></span>
				</c:if>
			</c:if>
		</div>
	</nav>
	
</header>