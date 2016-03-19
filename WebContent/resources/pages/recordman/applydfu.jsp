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
							<div class="form-group">
								<h3 class="heading"><fmt:message key="apply_dfu_heading" bundle="${bundle }"/></h3>
							   <span><fmt:message key="apply_dfu_config" bundle="${bundle }"/></span>
							   <div class="">
							     <button id="okbtn" onclick="apply()"  class="btn btn-lg btn-block btn-primary"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
							   </div>
							</div>
						</form>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/applydfu.js"></script>
</body>
</html>