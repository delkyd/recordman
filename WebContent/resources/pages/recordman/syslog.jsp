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
			<div id="content" class="container-fluid bluebk">
				<div class="fullpage">										
					<div class="row">
						<div >
							<div class="formstyle">
								<form class="form" onsubmit="return false;">
									<div class="form-group">
										<label class="control-label"><fmt:message key="loglevel" bundle="${bundle }"/></label>
										<div class="">
											<select id='loglevel' class="form-control">
												<option value=""><fmt:message key="all" bundle="${bundle }"/></option>
												<option value="error"><fmt:message key="loglevel_error" bundle="${bundle }"/></option>
												<option value="warning"><fmt:message key="loglevel_warn" bundle="${bundle }"/></option>
												<option value="info"><fmt:message key="loglevel_info" bundle="${bundle }"/></option>
											</select>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div >
							<div class="formstyle">
								<table class="table table-striped">
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
							</div>
						</div>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/syslog.js"></script>
</body>
</html>