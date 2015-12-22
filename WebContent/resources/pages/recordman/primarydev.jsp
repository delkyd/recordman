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
				<div class="primarydevs conf-container">					
					<div class="left devlist">
						<div class="formstyle">
							<form class="form" onsubmit="return false;">
								<div class="form-group">
									<label class=" control-label">设备类型</label>
									<div class="">
										<select id='' class="form-control">
											<option>所有</option>
											<option>线路</option>
											<option>变压器</option>
										</select>
									</div>
								</div>
							</form>
						</div>							
							<div class="list-group">
										<a class="list-group-item">
											#1主变
										</a>
										<a class="list-group-item">
											220kV静南I线
										</a>
										<a class="list-group-item active">
											220kV静南II线
										</a>
										<a class="list-group-item">
											220kV冲齐I线
										</a>
										<a class="list-group-item">
											220kV冲齐II线
										</a>
										<a class="list-group-item">
											110kV怒雅线
										</a>
							</div>
					</div>
					<div class="right property formstyle">
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class="control-label">名称</label>
								<div class="">
									<input id='' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label">类型</label>
								<div class="">
									<select id='' class="form-control">
										<option>线路</option>
										<option>变压器</option>
										<option>断路器</option>
										<option>电抗器</option>
									</select>
								</div>
							</div>
							
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-lg btn-block btn-primary">Update</button>
							     <button class="btn btn-lg btn-block btn-danger">Delete</button>
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
	<script src="<%=request.getContextPath()%>/resources/js/recordman/devconfig.js"></script>
</body>
</html>