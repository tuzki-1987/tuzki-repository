/**
 * 观影成绩单 主模块
 **/

$(function() {
	// 菜单点击事件
	$(".sub_nav ul li").click(function(){
		loginStatus();

		// 隐藏本月累计的二级菜单
		$("#mtSubMenu").hide();

		// 当前点击板块的索引
		var currentModelIndex = ($(".sub_nav ul li").index(this))*1+1;
		
		// 观影成绩单
		if(currentModelIndex == 1){
			resetSmallMenu(currentModelIndex, "观影成绩单", $(".sub_nav ul li").size());
			$("#gzt_show").load("/schedule/boxoffice/box_office_report.html");
		}

		// 首周人次分析
		if(currentModelIndex == 2){
			resetSmallMenu(currentModelIndex, "首周人次分析", $(".sub_nav ul li").size());
			$("#gzt_show").load("/schedule/boxoffice/person_of_film.html");
		}
		
		// 当日前五
		if(currentModelIndex == 3){
			resetSmallMenu(currentModelIndex, "当日前五", $(".sub_nav ul li").size());
			$("#gzt_show").load("/schedule/boxoffice/top5.html");
		}
		
		// 统计分析
		if(currentModelIndex == 4){
			resetSmallMenu(currentModelIndex, "统计分析", $(".sub_nav ul li").size());
			$("#gzt_show").load("/schedule/boxoffice/month_total.html");
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
function resetSmallMenu(curIndex, curText, tabNums) {
	var activeTabHTML = "<span>" + curText + "</span><img src='images/jiantou_03.png'/>";
	var normalTabHTML_start = "<a href='javascript:;'>";
	var normalTabHTML_end = "</a>";
	var curTab = "";
	
	for(var i = 0; i < tabNums; i++){
		if(i == curIndex - 1){
			$(".sub_nav ul li").eq(curIndex-1).html(activeTabHTML);
			if (curIndex == 4){
				$("#mtOneDay").find("span").text("");
				$("#mtOneDay").find("a").removeClass("active");
				$("#mtOneDay").find("a:eq(1)").addClass("active");
				$("#mtOneDay").find("a:eq(1)").find("span").text("（"+getCurDate()+"）");
				$("#mtSubMenu").show();
			}
		}else{
			if(i == 0)
				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + "观影成绩单" + normalTabHTML_end);
			if(i == 1)
				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + "首周人次分析" + normalTabHTML_end);
			if(i == 2)
				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + "当日前五" + normalTabHTML_end);
			if(i == 3)
				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + "统计分析" + normalTabHTML_end);
		}
	}
}
