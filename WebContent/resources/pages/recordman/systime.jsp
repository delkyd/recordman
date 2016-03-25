<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<html class="no-js" lang="en">
<head>
<%@ include file="../include/html_head.jsp"%>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/bootstrap-datetimepicker.min.css" />
</head>
<body>
	<%@ include file="../include/slidemenu.jsp"%>
	<div class="site-wrapper slideout-panel">				
		<%@ include file="../include/nav.jsp"%>	
			<div id="content" class="container-fluid bluebk">
				<div class="conf-container">					
					<div class="centerpage formstyle">
						<h1 class="heading"><fmt:message key="systime_heading" bundle="${bundle }"/></h1>
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class="control-label"><fmt:message key="systime_zone" bundle="${bundle }"/></label>
								<div>
									<select name="timezone" id="timezone" class="form-control">
										<option value="0"><fmt:message key="gmt-12" bundle="${bundle }"/></option>
										<option value="60"><fmt:message key="gmt-11" bundle="${bundle }"/></option>
										<option value="120"><fmt:message key="gmt-10" bundle="${bundle }"/></option>
										<option value="180"><fmt:message key="gmt-9" bundle="${bundle }"/></option>
										<option value="240"><fmt:message key="gmt-8" bundle="${bundle }"/></option>
										<option value="300"><fmt:message key="gmt-7" bundle="${bundle }"/></option>
										<option value="360"><fmt:message key="gmt-6" bundle="${bundle }"/></option>
										<option value="420"><fmt:message key="gmt-5" bundle="${bundle }"/></option>
										<option value="480"><fmt:message key="gmt-4" bundle="${bundle }"/></option>								
										<option value="510"><fmt:message key="gmt-3" bundle="${bundle }"/></option>								
										<option value="540"><fmt:message key="gmt-330" bundle="${bundle }"/></option>
										<option value="600"><fmt:message key="gmt-2" bundle="${bundle }"/></option>
										<option value="660"><fmt:message key="gmt-1" bundle="${bundle }"/></option>
										<option value="720"><fmt:message key="gmt0" bundle="${bundle }"/></option>
										<option value="780"><fmt:message key="gmt1" bundle="${bundle }"/></option>
										<option value="840"><fmt:message key="gmt2" bundle="${bundle }"/></option>
										<option value="900"><fmt:message key="gmt3" bundle="${bundle }"/></option>								
										<option value="930"><fmt:message key="gmt330" bundle="${bundle }"/></option>								
										<option value="960"><fmt:message key="gmt4" bundle="${bundle }"/></option>								
										<option value="990"><fmt:message key="gmt430" bundle="${bundle }"/></option>								
										<option value="1020"><fmt:message key="gmt5" bundle="${bundle }"/></option>								
										<option value="1050"><fmt:message key="gmt530" bundle="${bundle }"/></option>
										<option value="1065"><fmt:message key="gmt545" bundle="${bundle }"/></option>								
										<option value="1080"><fmt:message key="gmt6" bundle="${bundle }"/></option>								
										<option value="1110"><fmt:message key="gmt630" bundle="${bundle }"/></option>								
										<option value="1140"><fmt:message key="gmt7" bundle="${bundle }"/></option>
										<option value="1200" selected><fmt:message key="gmt8" bundle="${bundle }"/></option>
										<option value="1260"><fmt:message key="gmt9" bundle="${bundle }"/></option>								
										<option value="1290"><fmt:message key="gmt930" bundle="${bundle }"/></option>								
										<option value="1320"><fmt:message key="gmt10" bundle="${bundle }"/></option>
										<option value="1380"><fmt:message key="gmt11" bundle="${bundle }"/></option>
										<option value="1440"><fmt:message key="gmt12" bundle="${bundle }"/></option>
										<option value="1500"><fmt:message key="gmt13" bundle="${bundle }"/></option>
									</select>
								</div>								
							</div>
							
							<div class="form-group">
								<label class="control-label"><fmt:message key="systime_time" bundle="${bundle }"/></label>
								<div class="form-group">
				                	<div class='input-group date' id='datetimepicker1'>
					                    <input type='text' class="form-control" />
					                    <span class="input-group-addon">
					                        <span class="glyphicon glyphicon-calendar"></span>
					                    </span>
				                	</div>
            					</div>								
							</div>
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-lg btn-block btn-primary" onclick='updatetime()'><fmt:message key="update" bundle="${bundle }"/></button>
							   </div>
							</div>
						</form>
					</div>
					<%-- <div class="centerpage formstyle">
						<h1 class="heading"><fmt:message key="systime_synchronization" bundle="${bundle }"/></h1>
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class="control-label"><fmt:message key="systime_sync_type" bundle="${bundle }"/></label>
								<div>
									<select name="timezone" id="timezone" class="form-control">
										<option value=""><fmt:message key="systime_sync_type_ntp" bundle="${bundle }"/></option>
									</select>
								</div>								
							</div>
							<div class="form-group">
								<label class=" control-label"><fmt:message key="systime_sync_server" bundle="${bundle }"/>1</label>
								<div class="">
									<div id='ip1' class="form-control ip_input">
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label"><fmt:message key="systime_sync_server" bundle="${bundle }"/>2</label>
								<div class="">
									<div id='ip2' class="form-control ip_input">
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">
									</div>
								</div>
							</div>
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-lg btn-block btn-primary"><fmt:message key="update" bundle="${bundle }"/></button>
							   </div>
							</div>
						</form>
					</div> --%>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/moment-with-locales.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/bootstrap-datetimepicker.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/systime.js"></script>
</body>
</html>