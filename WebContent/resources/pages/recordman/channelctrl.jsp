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
							<div class="btn-group" id="channeltype_group" data-toggle="buttons">
							  <label class="btn btn-primary active">
							    <input type="radio" name="channeltypes" id="channeltype_ai" autocomplete="off" checked><fmt:message key="channeltype_ai" bundle="${bundle }"/>
							  </label>
							  <label class="btn btn-primary">
							    <input type="radio" name="channeltypes" id="channeltype_di" autocomplete="off"><fmt:message key="channeltype_di" bundle="${bundle }"/>
							  </label>
							</div>
							<div class="btn-group" id="board_group" data-toggle="buttons">
								<label class="btn btn-success active">
								    <input type="radio" name="boards" id="1" autocomplete="off" checked>#1
								</label>
								<label class="btn btn-success">
								    <input type="radio" name="boards" id="2" autocomplete="off">#2
								</label>
								<label class="btn btn-success">
								    <input type="radio" name="boards" id="3" autocomplete="off">#3
								</label>
								<label class="btn btn-success">
								    <input type="radio" name="boards" id="4" autocomplete="off">#4
								</label>
								<label class="btn btn-success">
								    <input type="radio" name="boards" id="5" autocomplete="off">#5
								</label>
								<label class="btn btn-success">
								    <input type="radio" name="boards" id="6" autocomplete="off">#6
								</label>
							</div>
						</div>
						<div class="formstyle table-responsive row">
							<div>
								<span id='board_name'>采集板卡1</span>
								<button type="button" class="btn btn-default" onclick="enableAll()"><fmt:message key="channel_enable_all" bundle="${bundle }"/></button>
								<button type="button" class="btn btn-default" onclick="disableAll()"><fmt:message key="channel_disable_all" bundle="${bundle }"/></button>
								<button type="button" class="btn btn-primary" onclick="update()"><fmt:message key="update" bundle="${bundle }"/></button>
							</div>
							<div class="col-md-6">
								<table id='channelTb1' class="table table-condensed table-hover table-striped">
									<thead>
										<tr>
											<th><fmt:message key="channel_th_enable" bundle="${bundle }"/></th>
											<th><fmt:message key="channel_th_terminal" bundle="${bundle }"/></th>
											<th><fmt:message key="channel_th_name" bundle="${bundle }"/></th>
										</tr>
									</thead>
									<tbody >
									</tbody>
								</table>
							</div>
							<div class="col-md-6">
								<table id='channelTb2' class="table table-condensed table-hover table-striped">
									<thead>
										<tr>
											<th><fmt:message key="channel_th_enable" bundle="${bundle }"/></th>
											<th><fmt:message key="channel_th_terminal" bundle="${bundle }"/></th>
											<th><fmt:message key="channel_th_name" bundle="${bundle }"/></th>
										</tr>
									</thead>
									<tbody >
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
	<script src="<%=request.getContextPath()%>/resources/js/recordman/channelctrl.js"></script>
</body>
</html>