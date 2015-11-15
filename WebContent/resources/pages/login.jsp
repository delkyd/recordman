<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
 <%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html class="no-js" lang="en">
<head>
	<%@ include file="include/html_head.jsp" %>
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/normalize.css" />
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/style.css" />
</head>
<body>
	<fmt:setBundle var="bundle" basename="codeman.i18n.resource.i18nstring" scope="page"/>
	<nav class="navbar navbar-default navbar-fixed-top navbar-inverse" id="nav">
			<div class="container">
				<img src="<%=request.getContextPath()%>/resources/images/wave.png" alt="Wave">
				<span class="navbar-brand"><fmt:message key="brand" bundle="${bundle }"/></span>
			</div>
	</nav>
	<div id="content" class="gradient1">
		<div class="container ">	
			<div class="loginFormBox center-block-form" id="loginform">
				<form class="form" onsubmit="return validLogin();" action="<%=request.getContextPath()%>/logon/login" method="post">
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1">
						<label id="tipMsg" >
						<c:choose>
							<c:when test="${empty loginFail}"><fmt:message key="login_tip" bundle="${bundle }"/></c:when>
							<c:otherwise>
							<fmt:message key="login_error_tip" bundle="${bundle }"/>
							</c:otherwise>
						</c:choose>
						</label>
					</div>					
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1">
						<label class="control-label sr-only" for="name">name</label>
						<span class="input-group-addon glyphicon glyphicon-user"></span>			
						<input type="text" id="name" name="name" autofocus="autofocus" class="form-control" placeholder="<fmt:message key="Inputaccount_tip" bundle="${bundle }"/>" />
					</div>
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1 ">
						<label class="control-label sr-only" for="pwd">password</label>
						<span class="input-group-addon glyphicon glyphicon-lock"></span>
						<input type="password" id="pwd" name="pwd" class="form-control" placeholder="<fmt:message key="Inputpwd_tip" bundle="${bundle }"/>" />
					</div>	
					<div class="form-group input-group input-group-lg col-xs-10 col-xs-offset-1">
						<button id="submitBtn" type="submit" class="btn btn-primary btn-lg btn-block"><fmt:message key="login" bundle="${bundle }"/></button>
			  		</div>	
				</form>
			</div>	
		</div>
	</div>	
	<%@ include file="include/footer.jsp" %>
	<%@ include file="include/html_footer.jsp"%>
  	<script src="<%=request.getContextPath()%>/resources/js/login/login.js"></script>
</body>
</html>