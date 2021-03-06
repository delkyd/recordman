<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<header id="nav" class="site-header">
	<nav class="container">
		<div class="mobile-header">
			<button class="btn-hamburger js-slideout-toggle btn-lg">
				<span class="glyphicon glyphicon-menu-hamburger"></span>
			</button>
			<a class="home" href=""><img src="<%=request.getContextPath()%>/resources/images/logo.png" alt="logo"><fmt:message key="product_name" bundle="${bundle }"/></a>
			<c:if test="${empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>/resources/pages/login.jsp"><fmt:message key="switch_Maintenance" bundle="${bundle }"/></a>
			</c:if>
			<c:if test="${!empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>//logon/login/?name=guest"><fmt:message key="switch_run" bundle="${bundle }"/></a>
			</c:if>
		</div>
		<div class="desktop-header">		
			<ul>
				<li><a class="home" href=""><img src="<%=request.getContextPath()%>/resources/images/logo.png" alt="logo"><fmt:message key="product_name" bundle="${bundle }"/></a></li>
				<c:if test="${empty user}">
					<li id='nav_faultrecord'><a href="<%=request.getContextPath()%>/runview/recordfile/"><fmt:message key="nav_faultrecord" bundle="${bundle }"/></a></li>
					<li id='nav_manualrecord'><a href="<%=request.getContextPath()%>/runview/manualrecord/"><fmt:message key="nav_manualrecord" bundle="${bundle }"/></a></li>
				</c:if>
				<c:if test="${!empty user && user.type==2}">
					<li id='nav_devconf'><a href="<%=request.getContextPath()%>/devparam/devconfig/"><fmt:message key="nav_setup_dev" bundle="${bundle }"/></a></li>							
					<li id='nav_channelctrl'><a href="<%=request.getContextPath()%>/devparam/channelctrl/"><fmt:message key="nav_dfu_channel" bundle="${bundle }"/></a></li>												
					<li id='nav_settingval'><a href="<%=request.getContextPath()%>/devparam/settingval/"><fmt:message key="nav_setup_setting" bundle="${bundle }"/></a></li>
					<li id='nav_line'><a href="<%=request.getContextPath()%>/devparam/line/"><fmt:message key="nav_mgr_Line" bundle="${bundle }"/></a></li>							
				</c:if>
				<c:if test="${!empty user && user.type>=3}">						
					<li id='nav_channels'><a href="<%=request.getContextPath()%>/mgrparam/channeltable/"><fmt:message key="nav_dfu_channel" bundle="${bundle }"/></a></li>
					<li id='nav_modules'><a href="<%=request.getContextPath()%>/mgrparam/modules/"><fmt:message key="nav_dfu_modules" bundle="${bundle }"/></a></li>						
					<li id='nav_settings'><a href="<%=request.getContextPath()%>/mgrparam/settings/"><fmt:message key="nav_dfu_setting" bundle="${bundle }"/></a></li>
					<li id='nav_dfuapply'><a href="<%=request.getContextPath()%>/mgrparam/dfuapply/"><fmt:message key="nav_dfu_apply" bundle="${bundle }"/></a></li>
					<li id='nav_mgrconf'><a href="<%=request.getContextPath()%>/mgrparam/mgrconfig/"><fmt:message key="nav_mgr_config" bundle="${bundle }"/></a></li>				
				</c:if>
				<c:if test="${!empty user}">				
					<li id='nav_sys' class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
						aria-haspopup="true" aria-expanded="true"><fmt:message key="nav_systemtool" bundle="${bundle }"/><span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="<%=request.getContextPath()%>/system/sysprocess/"><fmt:message key="nav_sys_process" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/system/systime/"><fmt:message key="nav_sys_settime" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/system/syspwd/"><fmt:message key="nav_sys_setpwd" bundle="${bundle }"/></a></li>						
							<li><a href="<%=request.getContextPath()%>/system/syslog/"><fmt:message key="nav_sys_syslog" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/system/sysreboot/"><fmt:message key="nav_sys_reboot" bundle="${bundle }"/></a></li>
						</ul>
					</li>
				</c:if>				
			</ul>
			<c:if test="${empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>/resources/pages/login.jsp"><fmt:message key="switch_Maintenance" bundle="${bundle }"/></a>
			</c:if>
			<c:if test="${!empty user}">
				<a class="loginItem" href="<%=request.getContextPath()%>//logon/login/?name=guest"><fmt:message key="switch_run" bundle="${bundle }"/></a>
			</c:if>
		</div>
	</nav>
	
</header>