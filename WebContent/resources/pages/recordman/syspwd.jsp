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
				<div class="conf-container">										
					<div class="centerpage formstyle">
						<form class="form" onsubmit="return false;">
							<h3 class="heading"><fmt:message key="syspwd_heading" bundle="${bundle }"/></h3>
							<div class="form-group">
								<label class="control-label"><fmt:message key="syspwd_name" bundle="${bundle }"/></label>
								<div>
									<input id='name' type="text" class="form-control">
								</div>								
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="syspwd_oldpwd" bundle="${bundle }"/></label>
								<div>
									<input id='oldpwd' type="password" class="form-control">
								</div>								
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="syspwd_newpwd" bundle="${bundle }"/></label>
								<div>
									<input id='newpwd' type="password" class="form-control">
								</div>								
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="syspwd_newpwd_confirm" bundle="${bundle }"/></label>
								<div>
									<input id='newpwd-confirm' type="password" class="form-control">
								</div>								
							</div>
							<div class="form-group">
							   <div class="">
							     <button id="okbtn" class="btn btn-lg btn-block btn-primary"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
							   </div>
							</div>
						</form>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/syspwd.js"></script>
</body>
</html>