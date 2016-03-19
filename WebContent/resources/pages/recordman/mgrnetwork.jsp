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
				<div class="netconfig conf-container">
					<div class="formstyle left ethernets ">
						<h3 class="heading"><fmt:message key="ethernet_list" bundle="${bundle }"/></h3>
						<div class="list-group ">							
							<c:forEach var="v" items="${protocols}" varStatus="s">
								<a class="list-group-item" id="${v.id }">
									<h5 class="list-group-item-heading">${v.netcard }</h5>
		    						<p class="list-group-item-text">${v.addr }/${v.mask }</p>
								</a>
							</c:forEach>
						</div>
					</div>
					<div class="config right formstyle">
						<form class="form" onsubmit="return false;">
							<h3 class="heading"><fmt:message key="ethernet_param" bundle="${bundle }"/></h3>
							<div class="form-group">
								<label class=" control-label"><fmt:message key="ethernet_name" bundle="${bundle }"/></label>
								<div class="">
									<input id='name' type="text" class="form-control" >
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label"><fmt:message key="ethernet_ip" bundle="${bundle }"/></label>
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
								<label class=" control-label"><fmt:message key="ethernet_mask" bundle="${bundle }"/></label>
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
								<label class=" control-label"><fmt:message key="ethernet_gate" bundle="${bundle }"/></label>
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
								<label class="control-label"><fmt:message key="devconf_commuprotocol" bundle="${bundle }"/></label>
								<div class="">
									<select id='protocolname' class="form-control">
										<option value="zj103"><fmt:message key="protocol_zj103" bundle="${bundle }"/></option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label"><fmt:message key="protocol_port" bundle="${bundle }"/></label>
								<div class="">
									<input id='protocolport' type="number" class="form-control" >
								</div>
							</div>
							<div class="form-group">
							   <div class=" ">
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
	<script src="<%=request.getContextPath()%>/resources/js/recordman/mgrnetwork.js"></script>
</body>
</html>