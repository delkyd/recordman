<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html class="no-js" lang="en">
<head>
	<%@ include file="include/html_head.jsp" %>
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/normalize.css" />
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/style.css" />
</head>
<body>
	<nav class="navbar navbar-default navbar-static-top navbar-inverse" id="nav">
			<div class="container">
				<span class="navbar-brand">故障录波器管理平台</span>
			</div>
	</nav>
	<div id="content" class="gradient1">
		<div class="container ">	
			<div class="loginFormBox center-block-form" id="loginform">
				<form class="form" onsubmit="return validLogin();" action="<%=request.getContextPath()%>/logon/login" method="post">
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1">
						<label id="tipMsg" >
						<c:choose>
							<c:when test="${empty loginFail}">请登录</c:when>
							<c:otherwise>
							用户名或密码错误,请重新输入
							</c:otherwise>
						</c:choose>
						</label>
					</div>					
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1">
						<label class="control-label sr-only" for="name">name</label>
						<span class="input-group-addon glyphicon glyphicon-user"></span>			
						<input type="text" id="name" name="name" autofocus="autofocus" class="form-control" placeholder="请输入用户名" />
					</div>
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1 ">
						<label class="control-label sr-only" for="pwd">password</label>
						<span class="input-group-addon glyphicon glyphicon-lock"></span>
						<input type="password" id="pwd" name="pwd" class="form-control" placeholder="请输入密码" />
					</div>	
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1">
						<button id="submitBtn" type="submit" class="btn btn-primary btn-lg btn-block">登录</button>
			  		</div>	
				</form>
			</div>	
		</div>
	</div>
	
	<%@ include file="include/footer.jsp" %>
  	<script src="<%=request.getContextPath()%>/resources/js/login/login.js"></script>
</body>
</html>