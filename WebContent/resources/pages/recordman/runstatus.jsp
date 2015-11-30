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
				<div class="runstatus-graph">
				  <div class="conclusion"><h2>Everything looks ok</h2></div>
				  <div class="image"></div>
				</div>
				<div class="runstatus-callouts row">
					<div class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon light_the_way"></div>
							<div class="title"><fmt:message key="runstatus_title_overview" bundle="${bundle }"/></div>
							<div class="content">启动时间:2015/03/30 11:32:53<br>运行时间:234天18小时24分44秒</div>
						</div>
					</div>
					<div class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon plenty_of_room"></div>
							<div class="title"><fmt:message key="runstatus_title_record" bundle="${bundle }"/></div>
							<div class="content">系统内目前共保存有23个录波文件<br>最新录波:PSL051130112412543782cpu1<br>最新录波时间:2015/11/30 11:24:12.543782</div>
						</div>
					</div>
					<div class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon skip_the_crowds"></div>
							<div class="title"><fmt:message key="runstatus_title_network" bundle="${bundle }"/></div>
							<div class="content">本录波器共有6个网络接口.目前4个网口连接正常,其中有3个网口有持续数据收发.</div>
						</div>
					</div>
					<div class="callout col-sm-6 col-lg-3">
						<div class="contained">
							<div class="icon byebye_buffering"></div>
							<div class="title"><fmt:message key="runstatus_title_version" bundle="${bundle }"/></div>
							<div class="content">当前软件版本: 4.19.18 Build 130123 Rel.32879n<br>当前硬件版本: WR845N 2.0 00000000</div>
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