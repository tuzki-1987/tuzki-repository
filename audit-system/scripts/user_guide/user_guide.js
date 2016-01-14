$(function() {
	returnTop();
	
	// 影院信息
	$("#loginNameJH").text(getCookie("jh_sdleLoginName"));
	server.queryAuditAccounts(function(callback) {
		if(callback != "" && callback != undefined) {
			var datasL = callback.length;
			// 顶部影院数量
			$("#childCinemaNumsJH").text(datasL);
		}
	});

	// 点击事件
	$(".guide-left-list").find("h3").click(show_hide);

	// 鼠标经过事件
	$(".guide-left-list").find("h3").hover(
		function() {
			$(this).css({"color":"#07637d", "cursor":"pointer"});
		},
		function() {
			if($(this).attr("data") == "0"){
				$(this).css({"color":"#7098a3", "cursor":"default"});
			}
		}
	);
});

// 显示、隐藏 内容
function show_hide() {
	var data = $(this).attr("data");
	if(data == 0){
			$(".guide-left-list-block").hide();
			var the_text = $(this).text();
			if(the_text.indexOf("6") != -1){	// 智能排片展示的二级内容项
				$(this).next(".guide-left-list-block").find(".guide-left-list-block").show();
			}
			
			$(".guide-left-list").css("color", "#7098a3");
			$(".guide-left-list").find("h3").attr("data", "0");
			$(".guide-left-list").find("h3").css("color", "#7098a3");

			$(this).css("color", "#07637d");
			$(this).attr("data", "1");
			$(this).next(".guide-left-list-block").slideDown();
	}
	if(data == 1) {
		$(this).next(".guide-left-list-block").slideUp();
		$(this).css("color", "#7098a3");
		$(this).attr("data", "0");
	}
}