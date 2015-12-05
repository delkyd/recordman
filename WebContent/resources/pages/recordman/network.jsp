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
			<div id="content" class="container-fluid">
				<div class="row faq">
					<div class="col-sm-4 list-group ethernets">
						<a class="list-group-item">
							<h4 class="list-group-item-heading">eth0</h4>
    						<p class="list-group-item-text">192.168.116.5/255.255.255.0</p>
						</a>
						<a class="list-group-item">
							<h4 class="list-group-item-heading">eth1</h4>
    						<p class="list-group-item-text">192.168.120.125/255.255.255.0</p>
						</a>
						<a class="list-group-item active">
							<h4 class="list-group-item-heading">eth2</h4>
    						<p class="list-group-item-text">11.123.87.5/255.0.0.0</p>
						</a>
						<a class="list-group-item">
							<h4 class="list-group-item-heading">eth3</h4>
    						<p class="list-group-item-text">10.41.15.5/255.255.0.0</p>
						</a>
						<a class="list-group-item">
							<h4 class="list-group-item-heading">eth4</h4>
    						<p class="list-group-item-text">未启用</p>
						</a>
						<a class="list-group-item">
							<h4 class="list-group-item-heading">eth5</h4>
    						<p class="list-group-item-text">未启用</p>
						</a>
					</div>
					<div class="col-sm-8">
						<form class="form-horizontal">
							<div class="form-group">
								<label class="col-sm-2 control-label">是否启用</label>
								<div class="col-sm-10">
									<input type="checkbox" data-toggle="toggle">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label">IP地址</label>
								<div class="col-sm-10">
									<div id='ip' class="ip_input">
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">
									</div>
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
	<script src="<%=request.getContextPath()%>/resources/js/recordman/network.js"></script>
</body>
</html>