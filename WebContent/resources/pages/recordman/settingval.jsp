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
				<div class="conf-container ">
					<div class='onepage'>
						<div class="formstyle form-inline ">
							<div class='form-group'>
								<label class="control-label"><fmt:message key="stgroup" bundle="${bundle }"/></label>
								<select id='stgroups' class="form-control">									
								</select>
							</div>
							<button class="btn btn-primary" onclick='update()'><fmt:message key="update" bundle="${bundle }"/></button>													
						</div>
						<div class="formstyle table-responsive ">
							<table id='settings' class="table table-condensed table-hover">
								<thead>
									<tr>
										<th><fmt:message key="set_group" bundle="${bundle }"/></th>
										<th><fmt:message key="set_name" bundle="${bundle }"/></th>
										<th><fmt:message key="set_unit" bundle="${bundle }"/></th>
										<th><fmt:message key="set_type" bundle="${bundle }"/></th>
										<th><fmt:message key="set_val" bundle="${bundle }"/></th>
										<th><fmt:message key="set_max" bundle="${bundle }"/></th>
										<th><fmt:message key="set_min" bundle="${bundle }"/></th>
										<th><fmt:message key="set_step" bundle="${bundle }"/></th>
										<th><fmt:message key="set_rate1" bundle="${bundle }"/></th>
										<th><fmt:message key="set_unit1" bundle="${bundle }"/></th>
										<th><fmt:message key="set_rate2" bundle="${bundle }"/></th>
										<th><fmt:message key="set_unit2" bundle="${bundle }"/></th>
									</tr>
								</thead>
								<tbody >
								</tbody>
							</table>
						</div>
					</div>					
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/settingval.js"></script>
</body>
</html>