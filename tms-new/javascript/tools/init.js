$(document).ready(function(){
	$('#ele1').click(function() { 
		$.blockUI({ message: $('#blk1') });	
	});
	$('#ele2').click(function() { 
		$.blockUI({ message: $('#blk2') });	
	});
	$('#ele3').click(function() { 
		$.blockUI({ message: $('#blk3') });	
	});
	$('#ele4').click(function() { 
		$.blockUI({ message: $('#blk4') });	
	});
	$('#ele5').click(function() { 
		$.blockUI({ message: $('#blk5') });	
	});
	$('#ele6').click(function() { 
		$.blockUI({ message: $('#blk6') });	
	});
	$('#ele7').click(function() { 
		$.blockUI({ message: $('#blk7') });	
	});
	$(".closeST").click(function(){
		$.unblockUI();
	});
	$("#closeST").click(function(){
		$.unblockUI();
	});
});