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
				<li id='nav_runstatus'><a href="<%=request.getContextPath()%>/runstatus/"><fmt:message key="nav_runstatus" bundle="${bundle }"/></a></li>				
				<li id='nav_faultrecord'><a href="<%=request.getContextPath()%>/recordfile/"><fmt:message key="nav_faultrecord" bundle="${bundle }"/></a></li>
				<c:if test="${user.type>=2}">
					<li id='nav_setup' class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
							aria-haspopup="true" aria-expanded="true"><fmt:message key="nav_setup" bundle="${bundle }"/><span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="<%=request.getContextPath()%>/devparam/devconfig/"><fmt:message key="nav_setup_dev" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/devparam/network/"><fmt:message key="nav_setup_network" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/mgrparam/network/"><fmt:message key="nav_mgr_network" bundle="${bundle }"/></a></li>							
							<li><a href="<%=request.getContextPath()%>/devparam/settingval/"><fmt:message key="nav_setup_setting" bundle="${bundle }"/></a></li>							
						</ul>
					</li>
				</c:if>
				<c:if test="${user.type>=3}">	
					<li id='nav_dfu' class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
							aria-haspopup="true" aria-expanded="true"><fmt:message key="nav_dfu" bundle="${bundle }"/><span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="<%=request.getContextPath()%>/devparam/channels/"><fmt:message key="nav_dfu_channel" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/devparam/modules/"><fmt:message key="nav_dfu_modules" bundle="${bundle }"/></a></li>						
							<li><a href="<%=request.getContextPath()%>/devparam/settings/"><fmt:message key="nav_dfu_setting" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/devparam/dfuapply/"><fmt:message key="nav_dfu_apply" bundle="${bundle }"/></a></li>
						</ul>
					</li>
					<li id='nav_mgr' class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
							aria-haspopup="true" aria-expanded="true"><fmt:message key="nav_mgr" bundle="${bundle }"/><span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="<%=request.getContextPath()%>/mgrparam/mgrconfig/"><fmt:message key="nav_mgr_config" bundle="${bundle }"/></a></li>
							<li><a href="<%=request.getContextPath()%>/mgrparam/line/"><fmt:message key="nav_mgr_Line" bundle="${bundle }"/></a></li>						
						</ul>
					</li>
				</c:if>
				<c:if test="${user.type>=2}">				
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
		</div>
	</nav>
</header>