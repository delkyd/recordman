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
				<div class="fullpage">
					<div class="chartsDiv">
						<div id="cpu" class="panelstyle">
						</div>
						<div id="memory" class="panelstyle">
						</div>
						<div id="disk" class="panelstyle">
						</div>
					</div>										
					<div class="row">
							<div class="formstyle">
								<table id="processes" class="table table-striped table-responsive">
									<thead>
										<tr>
											<th><fmt:message key="process_th_name" bundle="${bundle }"/></th>
											<th><fmt:message key="process_th_desc" bundle="${bundle }"/></th>
											<th><fmt:message key="process_th_time" bundle="${bundle }"/></th>
											<th><fmt:message key="process_th_cpu" bundle="${bundle }"/></th>
											<th><fmt:message key="process_th_memory" bundle="${bundle }"/></th>											
											<th><fmt:message key="process_th_status" bundle="${bundle }"/></th>
										</tr>
									</thead>
									<tbody>
										
									</tbody>
								</table>
							</div>					
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/bootstrap-toggle.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/highcharts-more.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/sysprocess.js"></script>
</body>
</html>