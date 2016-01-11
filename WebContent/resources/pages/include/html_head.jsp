<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<fmt:setBundle var="bundle" basename="recordman.i18n.resource.i18nstring" scope="page"/>
	<title><fmt:message key="web_title" bundle="${bundle }"/></title>
	<script type="text/javascript">
		var rootPath = "${rootPath}";
	</script>
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/bootstrap.min.css" />	
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/style.css" />
	
