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
				<div class="fullpage">										
					<div class="row">
						<div class="col-md-3">
							<div class="formstyle">
								<form class="form" onsubmit="return false;">
									<div class="form-group">
										<label class="control-label">类型</label>
										<div class="">
											<select id='' class="form-control">
												<option>所有</option>
												<option>业务</option>
												<option>系统</option>
											</select>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div class="col-md-9">
							<div class="formstyle">
								<table class="table table-striped">
									<thead>
										<tr>
											<th>#</th>
											<th>一</th>
											<th>二</th>
											<th>三</th>
											<th>四</th>
											<th>五</th>
											<th>六</th>
											<th>七</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											
										</tr>
										<tr>
											<td>1</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											
										</tr>
										<tr>
											<td>1</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											<td>First</td>
											
										</tr>
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
	<script src="<%=request.getContextPath()%>/resources/js/recordman/syslog.js"></script>
</body>
</html>