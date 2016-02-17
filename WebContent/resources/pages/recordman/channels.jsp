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
				<div class="channels conf-container">	
					<div class="image">
							<svg enable-background="new 0 0 128 128" height="128px" id="Layer_1" version="1.1" viewBox="0 0 128 128" width="128px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path d="M20,72h8v-8h-8V72z M20,88h8v-8h-8V88z M20,104h8v-8h-8V104z M44,64h-8v8h8V64z M44,80h-8v8h8V80z M60,64    h-8v8h8V64z M60,80h-8v8h8V80z M68,72h8v-8h-8V72z M68,88h8v-8h-8V88z M84,72h8v-8h-8V72z M84,88h8v-8h-8V88z M84,104h8v-8h-8V104    z M100,64v8h8v-8H100z M100,88h8v-8h-8V88z M100,104h8v-8h-8V104z M36,104h40v-8H36V104z" fill="#B0BEC5"/></g></g><path d="M108,48H68c12-13.332-12-26.668,0-40c-2.668,0-5.332,0-8,0c-12,13.332,12,26.668,0,40H20  c-8.836,0-16,7.164-16,16v40c0,8.836,7.164,16,16,16h88c8.836,0,16-7.164,16-16V64C124,55.164,116.836,48,108,48z M116,104  c0,4.41-3.59,8-8,8H20c-4.41,0-8-3.59-8-8V64c0-4.41,3.59-8,8-8h88c4.41,0,8,3.59,8,8V104z" fill="#546E7A"/></svg>
					</div>				
					<div class="left chl-info">
						<div class="bi info formstyle">
							<form class="form" onsubmit="return false;">
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_board" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_board' type="text" class="form-control" disabled>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_index" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_index' type="text" class="form-control" disabled>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_class" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_class' type="text" class="form-control" disabled>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label"><fmt:message key="terminal_name" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_name' type="text" class="form-control">
									</div>
								</div>								
								<div class="form-group onlyAi">
									<label class="control-label"><fmt:message key="terminal_Rate" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_Rate' type="text" class="form-control">
									</div>
								</div>
								<div class="form-group onlyBi">
									<label class="control-label"><fmt:message key="terminal_debounce" bundle="${bundle }"/></label>
									<div class="">
										<input id='terminal_debounce' type="text" class="form-control">
									</div>
								</div>
								<div class="form-group onlyBi">
									<label class="control-label"><fmt:message key="terminal_reverse" bundle="${bundle }"/></label>
									<div class="">
										<select id='terminal_reverse' class="form-control">
										<option value='0'><fmt:message key="no" bundle="${bundle }"/></option>
										<option value='1'><fmt:message key="yes" bundle="${bundle }"/></option>
									</select>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div class="right chl-config formstyle">
						<form class="form" onsubmit="return false;">
							<div class="form-group">
								<label class="control-label">通道名称</label>
								<div class="">
									<input id='' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label">一次设备</label>
								<div class="">
									<select id='' class="form-control">
										<option>创建新一次设备</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label">启动量状态</label>
								<div class="">
									<input id='toggle' type="checkbox" data-toggle="toggle">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label">启动量类型</label>
								<div class="">
									<select id='' class="form-control">
										<option>单相上限定值</option>
										<option>单相突变定值</option>
										<option>正序上限定值</option>
										<option>负序上限定值</option>
										<option>零序上限定值</option>
										<option>零序突变定值</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class=" control-label">参数范围</label>
								<div class="range">
									<input id='' type="text" class="form-control">
									~
									<input id='' type="text" class="form-control">
								</div>
							</div>
							<div class="form-group">
							   <div class="">
							     <button class="btn btn-lg btn-block btn-primary">Update</button>
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