<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="mobile-menu slideout-menu">
	<header class="menu-header"></header>
	<section class="menu-section">
		<ul class="menu-section-list">
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
				<li class="dropdownmenu">
					<a href="#" class="dropdownmenu-toggle"><fmt:message key="nav_systemtool" bundle="${bundle }"/> <span class="caret"></span></a>					
					<ul class="sub-menu">
						<li><a href="<%=request.getContextPath()%>/system/systime/"><fmt:message key="nav_sys_settime" bundle="${bundle }"/></a></li>
						<li><a href="<%=request.getContextPath()%>/system/syspwd/"><fmt:message key="nav_sys_setpwd" bundle="${bundle }"/></a></li>						
						<li><a href="<%=request.getContextPath()%>/system/syslog/"><fmt:message key="nav_sys_syslog" bundle="${bundle }"/></a></li>
						<li><a href="<%=request.getContextPath()%>/system/sysreboot/"><fmt:message key="nav_sys_reboot" bundle="${bundle }"/></a></li>
					</ul>
				</li>
			</c:if>
		</ul>
	</section>
</div>