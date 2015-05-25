/**
 * 票房成绩单 模块
 **/

$(function(){
	// 菜单点击事件
	$(".sub_nav ul li").click(function(){
		// 隐藏本月累计的二级菜单
		$("#mtSubMenu").hide();

		// 当前点击板块的索引
		var currentModelIndex = ($(".sub_nav ul li").index(this))*1+1;
		
		// 票房成绩单
		if(currentModelIndex == 1){
			resetSmallMenu(currentModelIndex, "选项卡 1 内容", $(".sub_nav ul li").size());
			$("#gzt_show").load("boxoffice/box_office_report.html");
		}
		
		// 当日前五
		if(currentModelIndex == 2){
			resetSmallMenu(currentModelIndex, "选项卡 2 内容", $(".sub_nav ul li").size());
			$("#gzt_show").load("boxoffice/top5.html");
		}
		
		// 本月累计
		if(currentModelIndex == 3){
			resetSmallMenu(currentModelIndex, "Highcharts 实践", $(".sub_nav ul li").size());
			$("#gzt_show").load("boxoffice/month_total.html");
		}
	});
	
	// 返回顶部
	returnTop();
});

/**
 * 重置左侧菜单样式
 * 
 * @param 
 * 		curIndex 当前点击菜单下标
 * 		curText  当前点击菜单名字
 * 		tabNums  菜单总数
 * @return
 * */
function resetSmallMenu(curIndex, curText, tabNums){
	var activeTabHTML = "<span>" + curText + "</span><img src='images/jiantou_03.png'/>";
	var normalTabHTML_start = "<a href='javascript:;'>";
	var normalTabHTML_end = "</a>";
	var curTab = "";
	
	for(var i = 0; i < tabNums; i++){
		if(i == curIndex - 1){
			$(".sub_nav ul li").eq(curIndex-1).html(activeTabHTML);
			if (curIndex == 3){
				$("#mtOneDay").find("span").text("");
				$("#mtOneDay").find("a").removeClass("active");
				$("#mtOneDay").find("a:eq(1)").addClass("active");
				$("#mtOneDay").find("a:eq(1)").find("span").text("（"+getCurDate()+"）");
				$("#mtSubMenu").show();
			}
		}else{
			if(i == 0)
				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + "选项卡 1 内容" + normalTabHTML_end);
			if(i == 1)
				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + "选项卡 2 内容" + normalTabHTML_end);
			if(i == 2)
				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + "Highcharts 实践" + normalTabHTML_end);
		}
	}
}
