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
						<div class="form-group">
							<select id='dev' class="form-control">
								<option>工控机</option>
								<option>DSP</option>
							</select>
						</div>
						<div class="form-group">
							<select id='period' class="form-control">
								<option>一周</option>
								<option>一月</option>
								<option>半年</option>
								<option>一年</option>
								<option>自定义</option>
							</select>
						</div>						
						<div class="form-group">
							<button class="btn btn-default">Query</button>
						</div>
					</form>				
				</div>
				<div class="result-zone">
					<div class="day-zone blue">
						<div class="heading color">
							<h1>2015-12-6</h1>
							<span>共9个文件,其中5个有故障</span>
						</div>
						<div class="gallery">
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
						</div>
					</div>
					<div class="day-zone yellow">
						<div class="heading color">
							<h1>2015-12-5</h1>
							<span>共9个文件,其中5个有故障</span>
						</div>
						<div class="gallery">
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
						</div>
					</div>
					<div class="day-zone pink">
						<div class="heading color">
							<h1>2015-12-4</h1>
							<span>共9个文件,其中5个有故障</span>
						</div>
						<div class="gallery">
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
						</div>
					</div>
					<div class="day-zone green">
						<div class="heading color">
							<h1>2015-12-3</h1>
							<span>共9个文件,其中5个有故障</span>
						</div>
						<div class="gallery">
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
							<div class="item">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<%@ include file="../include/footer.jsp"%>
	</div>	
	<%@ include file="../include/html_footer.jsp"%>
	<script
		src="<%=request.getContextPath()%>/resources/js/recordman/runstatus.js"></script>
</body>
</html>