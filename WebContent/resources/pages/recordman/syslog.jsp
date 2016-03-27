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
				<div class="fullpage">										
					<div class="row">
						<div >
							<div class="formstyle">
								<form class="form-inline" onsubmit="return false;">
									<div class="form-group">
										<label class="control-label"><fmt:message key="loglevel" bundle="${bundle }"/></label>
											<select id='loglevel' class="form-control">
												<option value=""><fmt:message key="all" bundle="${bundle }"/></option>
												<option value="error"><fmt:message key="loglevel_error" bundle="${bundle }"/></option>
												<option value="warning"><fmt:message key="loglevel_warn" bundle="${bundle }"/></option>
												<option value="info"><fmt:message key="loglevel_info" bundle="${bundle }"/></option>
											</select>
									</div>
									<div class="form-group">
										<label class="control-label"><fmt:message key="time" bundle="${bundle }"/></label>
										<div class='input-group date ' id='datetimepicker1' >
											<input type='text' class="form-control" /> <span
												class="input-group-addon"> <span
												class="glyphicon glyphicon-calendar"></span>
											</span>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label">--</label>
										<div class='input-group date ' id='datetimepicker2' >
											<input type='text' class="form-control" /> <span
												class="input-group-addon"> <span
												class="glyphicon glyphicon-calendar"></span>
											</span>
										</div>
									</div>
									<div class="form-group">
										<button id="query" class="btn btn-default" ><fmt:message key="query" bundle="${bundle }"/></button>
									</div>
									<div class="form-group rightfloat">
										<label class="control-label"><fmt:message key="numPrePage" bundle="${bundle }"/></label>
											<select id='numPrePage' class="form-control">
												<option value="10">10</option>
												<option value="15" selected>15</option>
												<option value="20">20</option>
												<option value="25">25</option>
												<option value="30">30</option>
												<option value="40">40</option>
												<option value="50">50</option>
											</select>
									</div>
								</form>
							</div>
						</div>
						<div >
							<div class="formstyle">
								<table id="logs" class="table table-striped table-responsive">
									<thead>
										<tr>
											<th><fmt:message key="log_thead_id" bundle="${bundle }"/></th>
											<th><fmt:message key="log_thead_level" bundle="${bundle }"/></th>
											<th><fmt:message key="log_thead_date" bundle="${bundle }"/></th>
											<th><fmt:message key="log_thead_content" bundle="${bundle }"/></th>
											<th><fmt:message key="log_thead_user" bundle="${bundle }"/></th>
											<th><fmt:message key="log_thead_addr" bundle="${bundle }"/></th>
										</tr>
									</thead>
									<tbody>
										
									</tbody>
								</table>
								<ul id="tb_pagination" class="pagination"></ul>
							</div>
							
						</div>
						
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/moment-with-locales.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/bootstrap-datetimepicker.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/jquery.twbsPagination.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/syslog.js"></script>
</body>
</html>