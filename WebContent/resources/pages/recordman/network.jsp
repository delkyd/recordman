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
				<div class="netconfig conf-container">
					<div class="list-group ethernets left">
						<c:forEach var="v" items="${ethernets}" varStatus="s">
							<a class="list-group-item" id="${v.index }">
								<h4 class="list-group-item-heading">${v.name }</h4>
	    						<p class="list-group-item-text">${v.ip }/${v.mask }</p>
							</a>
						</c:forEach>
					</div>
					<div class="config right formstyle">
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class=" control-label">名称</label>
								<div class="">
									<input id='name' type="text" class="form-control" placeholder="建议填入有意义的名字">
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label">IP地址</label>
								<div class="">
									<div id='ip' class="form-control ip_input">
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label">子网掩码</label>
								<div class="">
									<div id='netmask' class="form-control ip_input">
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label">网关</label>
								<div class="">
									<div id='gate' class="form-control ip_input">
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">
									</div>
								</div>
							</div>
							<div class="form-group">
							   <div class=" ">
							     <button class="btn btn-lg btn-block btn-primary" onclick='update()'>Update</button>
							   </div>
							</div>
						</form>
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/network.js"></script>
</body>
</html>