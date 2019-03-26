/**
* 弹层
* @description: 注册相关事件
**/

function registEvent() {
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
	$(".closeST, #closeST").click(function(){
		$.unblockUI();
	});
}