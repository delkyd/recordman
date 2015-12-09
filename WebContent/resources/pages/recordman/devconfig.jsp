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
				<div class="devconfig ">					
					<div class="config">
						<h1 class="heading">装置基本参数</h1>
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class="control-label">厂站名称</label>
								<div class="">
									<input id='station_name' type="text" class="form-control" placeholder="变电站名称">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label">公司名称</label>
								<div class="">
									<input id='company_name' type="text" class="form-control" placeholder="公司名称">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label">装置名称</label>
								<div class="">
									<input id='dev_name' type="text" class="form-control" placeholder="装置名称">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label">序列号</label>
								<div class="">
									<input id='dev_serial' type="text" class="form-control" placeholder="产品序列号">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label">装置型号</label>
								<div class="">
									<select id='dev_type' class="form-control">
										<option>Ben5000</option>
										<option>Ben8000</option>
										<option>Ben10086</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label">通信规约</label>
								<div class="">
									<select id='commu_protocol' class="form-control">
										<option>浙江103</option>
										<option>61850</option>
										<option>Ben10086</option>
									</select>
								</div>
							</div>
							
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-lg btn-block btn-primary">Update</button>
							   </div>
							</div>
						</form>
					</div>
					<div class="branding">
						<span class="log"></span>
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