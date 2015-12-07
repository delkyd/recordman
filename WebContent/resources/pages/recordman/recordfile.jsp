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
								<h4>09:54:23.153200</h4>
								<h5>cpu120151206095423153200</h5>
								<h3>A相短路</h3>
							</div>
							<div class="item">
								<h4>09:54:23.153200</h4>
								<h5>cpu120151206095423153200</h5>
								<h3>B相短路</h3>
							</div>
							<div class="item">
								<h4>09:54:23.153200</h4>
								<h5>220kV录波器cpu120151206095423153200</h5>
								<h3>C相短路</h3>
							</div>
							<div class="item">
								<h4>09:54:23.153200</h4>
								<span>cpu120151206095423153200_shiyishihenchangdemingzi还有中文</span>
								<h3>ABC三相接地</h3>
							</div>
							<div class="item">
								<h4>09:54:23.153200</h4>
								<h5>cpu12015120609</h5>
								<h3>AB相短路</h3>
							</div>
							<div class="item">
								<h4>09:54:23.153200</h4>
								<h5>cpu120</h5>
								<h3>BC相短路</h3>
							</div>
							<div class="item">
								<h4>09:54:23.153200</h4>
								<h5>cpu120151206095423153200</h5>
								<h3>CA相短路</h3>
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
		src="<%=request.getContextPath()%>/resources/js/recordman/recordfile.js"></script>
</body>
</html>