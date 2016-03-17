<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<html class="no-js" lang="en">
<head>
<%@ include file="../include/html_head.jsp"%>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/bootstrap-toggle.min.css" />
</head>
<body>
	<%@ include file="../include/slidemenu.jsp"%>
	<div class="site-wrapper slideout-panel">				
		<%@ include file="../include/nav.jsp"%>	
			<div id="content" class="container-fluid bluebk">
				<div class="channels conf-container">	
					<div class="image">
						<embed id="svgEle" src="<%=request.getContextPath()%>/resources/images/terminal.svg" type="image/svg+xml" width=100% height="158px">
					</div>				
					<div class="left terminal-info formstyle">
							<form class="form" onsubmit="return false;">
								<h3 class="heading"><fmt:message key="terminal_heading" bundle="${bundle }"/></h3>
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_board" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_board' type="text" class="form-control" disabled>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_index" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_index' type="text" class="form-control" disabled>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_name" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_name' type="text" class="form-control">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_type" bundle="${bundle }"/></label>
									<div class="">
										<select id='terminal_type' class="form-control">
										</select>
									</div>
								</div>								
								<div class="form-group onlyAi">
									<label class="control-label"><fmt:message key="terminal_Rate" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_rate' type="text" class="form-control">
									</div>
								</div>
								<div class="form-group onlyBi">
									<label class="control-label"><fmt:message key="terminal_debounce" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_debounce' type="text" class="form-control">
									</div>
								</div>
								<div class="form-group onlyBi">
									<label class="control-label"><fmt:message key="terminal_reverse" bundle="${bundle }"/></label>
									<div class="">
										<select id='terminal_reverse' class="form-control">
										<option value='0'><fmt:message key="no" bundle="${bundle }"/></option>
										<option value='1'><fmt:message key="yes" bundle="${bundle }"/></option>
									</select>
									</div>
								</div>
							</form>
					</div>
					<div class="right channel-info formstyle">
						<form class="form" onsubmit="return false;">
							<h3 class="heading"><fmt:message key="channel_heading" bundle="${bundle }"/></h3>
							<div class="form-group">
								<label class="control-label"><fmt:message key="channel_id" bundle="${bundle }"/></label>
								<div class="">
									<input id='channel_id' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="channel_name" bundle="${bundle }"/></label>
								<div class="">
									<input id='channel_name' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group onlyAi">
								<label class="control-label"><fmt:message key="channel_unit" bundle="${bundle }"/></label>
								<div class="">
									<input id='channel_unit' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group onlyAi">
								<label class="control-label"><fmt:message key="channel_rate1" bundle="${bundle }"/></label>
								<div class="">
									<input id='channel_rate1' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group onlyAi">
								<label class="control-label"><fmt:message key="channel_unit1" bundle="${bundle }"/></label>
								<div class="">
									<input id='channel_unit1' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group onlyAi">
								<label class="control-label"><fmt:message key="channel_rate2" bundle="${bundle }"/></label>
								<div class="">
									<input id='channel_rate2' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group onlyAi">
								<label class="control-label"><fmt:message key="channel_unit2" bundle="${bundle }"/></label>
								<div class="">
									<input id='channel_unit2' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group onlyBi">
								<label class="control-label"><fmt:message key="channel_val" bundle="${bundle }"/></label>
								<div class="">
									<select id='channel_val' class="form-control">
										<option value='0'>0</option>
										<option value='1'>1</option>
									</select>
								</div>
							</div>
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-block btn-primary" onclick='update()'><fmt:message key="update" bundle="${bundle }"/></button>
							   </div>
							</div>
						</form>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/bootstrap-toggle.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/channels.js"></script>
</body>
</html>