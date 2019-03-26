jQuery.divselect = function(divselectid,inputselectid) {
	// $(divselectid+" cite").unbind("click");
	// $(divselectid+" ul li a").unbind("click");
	// $(document).unbind("click");

	var objX, objXx,
		inputselect = $(inputselectid);
	$(divselectid+" cite").unbind("click").click(function(e){
		e = e || event;
		objX = e.clientX;
		
		var ul = $(divselectid+" ul");
		if(ul.css("display")=="none"){
			ul.slideDown("fast");
		}else{
			ul.slideUp("fast");
		}
	});
	$(divselectid+" ul li a").unbind("click").click(function(){
		var txt = $(this).text();
		$(divselectid+" cite").html(txt);
		var value = $(this).attr("selectid");
		inputselect.val(value);
		$(divselectid+" ul").hide();
		// 复制排期时, 监控全厅
		scheduleLogsObj.handleListenAllForCopySch(inputselectid, value);
	});
	$(document).click(function(e){
		e = e || event;
		objXx = e.clientX;
		// console.log(objX+" - "+objXx);
		if(objXx != objX)$(divselectid+" ul").hide();
	});
	// $("#ele1").unbind("click");
};