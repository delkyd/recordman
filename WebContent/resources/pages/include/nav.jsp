<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<nav class="navbar navbar-default navbar-static-top navbar-inverse" id="nav">
	<div class="container">
		<div class="navbar-header">
			<span class="navbar-brand brand">微信公众号管理平台</span>
		</div>
		<div class="navbar-collpase">
			<ul class="nav navbar-nav">
				<li id="leave"><a href="<%=request.getContextPath()%>/mgn/leavehospital/showinhospitals">出院</a></li>	
				<li id="followup"><a href="<%=request.getContextPath()%>/mgn/followup/showleavehospitals">回访</a></li>				
				<li id="question" class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" 
					aria-haspopup="true" aria-expanded="false">管理 <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a href="<%=request.getContextPath()%>/mgn/question/showquestions">问题</a></li>
						<li><a href="<%=request.getContextPath()%>/mgn/questionnaire/showquestionnaires">问卷</a></li>
						<li><a href="<%=request.getContextPath()%>/mgn/disease/showdiseases">病症</a>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</nav>