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
				<div class="devconfig conf-container">					
					<div class="config left formstyle">
						<h1 class="heading"><fmt:message key="devconf_heading" bundle="${bundle }"/></h1>
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_stationname" bundle="${bundle }"/></label>
								<div class="">
									<input id='station_name' type="text" class="form-control" value="${infos.station}">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_devname" bundle="${bundle }"/></label>
								<div class="">
									<input id='dev_name' type="text" class="form-control" value="${infos.name}">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_devmodel" bundle="${bundle }"/></label>
								<div class="">
									<input id='dev_model' type="text" class="form-control" disabled value="${infos.model}">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_version" bundle="${bundle }"/></label>
								<div class="">
									<input id='dev_version' type="text" class="form-control" disabled value="${infos.version}">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label"><fmt:message key="devconf_remark" bundle="${bundle }"/></label>
								<div class="">
									<input id='dev_remark' type="text" class="form-control" value="${infos.remark}">
								</div>
							</div>
							
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-block btn-primary" onclick='update()'><fmt:message key="update" bundle="${bundle }"/></button>
							   </div>
							</div>
						</form>
					</div>
					<div class="ethernets right formstyle editableListgroup">
						<h3 class="heading"><fmt:message key="ethernet_list" bundle="${bundle }"/></h3>
						<div class="list-group ">							
							<c:forEach var="v" items="${ethernets}" varStatus="s">
								<a class="list-group-item" id="${v.index }" ondblclick='editEthernet(${v.index })'>
									<h5 class="list-group-item-heading">${v.name }</h5>
		    						<span class="list-group-item-text">${v.ip }/${v.mask }</span>
		    						<button class="customBtn editBtn" title="" onclick='editEthernet(${v.index })'></button>
								</a>
							</c:forEach>
						</div>						
					</div>
				</div>
			</div>
		<%@ include file="../include/footer.jsp"%>
	</div>
	<div class="modal fade" id="editEthernetModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"><fmt:message key="module_param" bundle="${bundle }"/></h4>
	      </div>
	      <div class="modal-body">
	       <form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class=" control-label"><fmt:message key="ethernet_name" bundle="${bundle }"/></label>
								<div class="">
									<input id='eth_name' type="text" class="form-control" >
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label"><fmt:message key="ethernet_ip" bundle="${bundle }"/></label>
								<div class="">
									<div id='eth_ip' class="form-control ip_input">
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
									<div id='eth_netmask' class="form-control ip_input">
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
									<div id='eth_gate' class="form-control ip_input">
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">.
										<input type="text" class="item">
									</div>
								</div>
							</div>
							<div class="form-group" id='protocolgroup'>
								<label class="control-label"><fmt:message key="devconf_commuprotocol" bundle="${bundle }"/></label>
								<div class="">
									<select id='eth_protocolname' class="form-control">
										<option value="zj103"><fmt:message key="protocol_zj103" bundle="${bundle }"/></option>
									</select>
								</div>
							</div>
							<div class="form-group" id='portgroup'>
								<label class=" control-label"><fmt:message key="protocol_port" bundle="${bundle }"/></label>
								<div class="">
									<input id='eth_protocolport' type="number" class="form-control" >
								</div>
							</div>
						</form>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="btn_cancel" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-primary" id="eth_save"><fmt:message key="btn_ok" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/devconfig.js"></script>
</body>
</html>