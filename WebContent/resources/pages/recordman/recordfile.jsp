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
								<option value='3'>一月</option>
								<option value='4'>半年</option>
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
							<button id="query" class="btn btn-default">Query</button>
						</div>
					</form>				
				</div>
				<div class="result-zone">

				</div>
			</div>
		</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/moment-with-locales.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/bootstrap-datetimepicker.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/recordman/recordfile.js"></script>
</body>
</html>