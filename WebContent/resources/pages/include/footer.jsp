<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <div class="modal fade" id="alertModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title"></h4>
	      </div>
	      <div class="modal-body">
	        <p id="alertContent"></p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	
	<div class="modal fade" id="confirmModal" role="dialog" aria-labelledby="confirmDeleteLabel" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h4 class="modal-title"></h4>
	      </div>
	      <div class="modal-body">
	        <p></p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" id="cancel" data-dismiss="modal"><fmt:message key="close" bundle="${bundle }"/></button>
	        <button type="button" class="btn btn-danger" id="confirm"><fmt:message key="confirm" bundle="${bundle }"/></button>
	      </div>
	    </div>
	  </div>
	</div>
<footer>
		<div class="container" id='footer'>
			<p>
				Copyright © 2015 - 2017 <fmt:message key="company_name" bundle="${bundle }"/>, All Rights Reserved.
			</p>
		</div>
	</footer>