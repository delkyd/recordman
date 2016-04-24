<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<html class="no-js" lang="en">
<head>
<%@ include file="../include/html_head.jsp"%>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/bootstrap-datetimepicker.min.css" />
</head>
<body>
	<%@ include file="../include/slidemenu.jsp"%>
	<div class="site-wrapper slideout-panel">				
		<%@ include file="../include/nav.jsp"%>	
		<div id="content" class="container-fluid">
			<div class="faq">
				<div class="query-bar">
					<form class="form-inline" onsubmit="return false;">
						<div class="form-group">
							<select id='source' class="form-control">
								<option>暂态</option>
								<option>稳态</option>
							</select>
						</div>
						<!-- <div class="form-group" >
							<select id='dev' class="form-control">
								<option>工控机</option>
								<option>DSP</option>
							</select>
						</div> -->
						<div class="form-group">
							<select id='period' class="form-control">
								<option value='1'>一天</option>
								<option value='2'>一周</option>
								<option value='3' >一月</option>
								<option value='4' selected="selected">半年</option>
								<option value='5'>一年</option>
								<option value='0'>自定义</option>
							</select>
						</div>
						<div class="form-group">
							<div class='input-group date' id='datetimepicker1' style="display: none;">
								<input type='text' class="form-control" /> <span
									class="input-group-addon"> <span
									class="glyphicon glyphicon-calendar"></span>
								</span>
							</div>
						</div>
						<div class="form-group">
							<div class='input-group date' id='datetimepicker2' style="display: none;">
								<input type='text' class="form-control" /> <span
									class="input-group-addon"> <span
									class="glyphicon glyphicon-calendar"></span>
								</span>
							</div>
						</div>
						<div class="form-group">
							<button id="query" class="btn btn-default" style="display: none;"><fmt:message key="query" bundle="${bundle }"/></button>
						</div>
						
						<div class="btn-group rightfloat" data-toggle="buttons">
						  <label class="btn btn-primary active">
						    <input type="radio" name="options" id="option1" autocomplete="off" checked> 图形
						  </label>
						  <label class="btn btn-primary">
						    <input type="radio" name="options" id="option2" autocomplete="off"> 列表
						  </label>
						</div>
					</form>				
				</div>
				<div class="result-zone">

				</div>
			</div>
		</div>
		<form method="post"></form>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/wave.jsp"%>
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/moment-with-locales.min.js"></script>	
	<script src="<%=request.getContextPath()%>/resources/js/bootstrap-datetimepicker.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/jscomtrade.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/jsvectorgraph.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/wave.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/recordfile.js"></script>
</body>
</html>