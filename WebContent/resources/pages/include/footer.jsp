<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="modal fade" id="alertModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title">提示</h4>
	      </div>
	      <div class="modal-body">
	        <p id="alertContent">One fine body</p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	
	<div class="modal fade" id="confirmModal" role="dialog" aria-labelledby="confirmDeleteLabel" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h4 class="modal-title">删除确认</h4>
	      </div>
	      <div class="modal-body">
	        <p>您确定要删除此项吗?</p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" id="cancel" data-dismiss="modal">取消</button>
	        <button type="button" class="btn btn-danger" id="confirm">确定</button>
	      </div>
	    </div>
	  </div>
	</div>
<footer>
		<div class="container" id='footer'>
			<p>
				Copyright © 2015 - 2017 上海录波侠科技有限公司, All Rights Reserved.
			</p>
		</div>
	</footer>
<script src="<%=request.getContextPath()%>/resources/js/jquery-1.11.3.min.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/bootstrap.min.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/public.js"></script>