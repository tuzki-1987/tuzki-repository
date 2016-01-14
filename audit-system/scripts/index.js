/*
 * 主框架文件
 *
 * @author ccq
 */


var controlShowHide = 0;	// 循环显示、隐藏的控制变量
var objX, objY;				// 用于隐藏当前对象的 "坐标比较变量"

/**
* 一级菜单点击事件
**/
function firstMenuEvent(obj) {
	// 首先判断登录状态
	// loginStatus();

	var curIndex = $(obj).parent("li").index();
	$(".nav-menus").find("li").removeClass("active");
	$(".nav-menus").find("li").find(".has-sub-nav").attr("data", "0");
	$(".sub-nav").hide();
	$(".sub-nav a").removeClass("active");
	
	$(obj).parent().addClass("active");
	loadPage(curIndex, null);
}

/**
* 二级菜单显示/隐藏
*
* @param obj 当前对象
**/
function clickSubNav(obj) {
	var status = $(obj).attr("data");	// 当前菜单状态(0:收起, 1:展开)
	
	if(status*1 == 0) {
		$(obj).next(".sub-nav").slideDown();
		setTimeout(function() {
			$(obj).attr("data", "1");
		}, 200);
		
	}
	if(status*1 == 1) {
		$(obj).next(".sub-nav").slideUp();
		setTimeout(function() {
			$(obj).attr("data", "0");
		}, 200);
	}
}

/**
* 二级菜单点击
*
* @param obj 当前对象
* @param firstLevel 一级菜单索引值
* @param subLevel 二级菜单索引值
**/
function clickSubMenu(obj, firstLevel, subLevel) {
	// 首先判断登录状态
	// loginStatus();

	$(".nav-menus").find("li").removeClass("active");
	$(".nav-menus").find("li").find(".sub-nav").find("a").removeClass("active");
	$(".nav-menus").find("li").find(".sub-nav").hide();
	$(".nav-menus").find("li").find(".has-sub-nav").attr("data", "0");
	$(obj).parent().prev("a").attr("data", "1");

	$(obj).parent().parent().addClass("active");
	$(obj).addClass("active");
	$(obj).parent().show();
	loadPage(firstLevel, subLevel);
}

/**
* 初始化页面隐藏域的值
**/
function initHiddenFiledVal() {
	$("#initSchDate").val("");
	$("#cinemaId").val("");
	$("#schTipDate").val("");
	$("#ctrlCreateSchBtn").val("");
	$("#groupSchDate").val("");
	$("#uploadTabIndex").val("");
}

/**
* 初始化设置事项(首次访问)
**/
function initSetMenu(behavior) {
	// var flag = loginStatus();
	var flag = true;

	if(flag) {
		$("#loginNameJH").text(getCookie("jh_sdleLoginName"));
		var obj = $(".nav-menus").find("li:eq(0)").find("a:eq(0)");
		clickSubNav(obj);
		loadPage(0, null);
		// 返回顶部
		returnTop();
		// 初始化隐藏域
		initHiddenFiledVal();

		// 返回按钮
		if(behavior) {
			$(".nav-menus").find("li:eq(0)").addClass("active alone-menu");
			$(".nav-menus").find("li:eq(5)").addClass("alone-menu");
			$(".nav-menus").find("li:eq(6)").addClass("alone-menu");
			$(".nav-menus").find("li:eq(7)").addClass("alone-menu");
			// 显示独立菜单
			$(".nav-menus").find("li.alone-menu").show();
			// 影院菜单控制
			$(".nav-menus").find("li:eq(1)").addClass("cinema-menu");
			$(".nav-menus").find("li:eq(2)").addClass("cinema-menu");
			$(".nav-menus").find("li:eq(3)").addClass("cinema-menu");
			$(".nav-menus").find("li:eq(4)").addClass("cinema-menu");
			$(".nav-menus").find("li:eq(9)").addClass("cinema-menu");
		}
	}
}

/**
* 快速导航点击事件
* 
* @description 当浏览器窗口大小改变，至"快速菜单按钮"出现时，点击该按钮，导航菜单的显示/隐藏及显示内容
**/
function showQuickNav() {
	$(".nav-menus2").html($(".nav-menus").html());
	$(".nav-menus2").show();
}

/**
* 浏览器窗口尺寸改变时
**/
window.onresize = function() {
	var scrnW = window.screen.availWidth;	// 屏幕可用工作区宽度
	var workW = document.documentElement.clientWidth;	// 可见区域宽度

	if(!(muObj.disp)) {
		muObj.disp = true;
	}

	var disp = $(".navbar-toggle").css("display");
	if(disp == "none")
		$(".nav-menus2").hide();
	else
		$(".nav-menus2").show();
};

/**
* 打开/隐藏 影院列表面板
*
* @param obj 当前对象
* @param e 事件对象
**/
function openCinemaListPannel(obj, e) {
	// 设置背景色
	$(obj).addClass("location-box-bg");

	e = e || event;
	objX = e.clientX, objY = e.clientY;
	// 当前影院指示区 宽度
	var pannel_box = $(".location-box").width();
	pannel_box = pannel_box + 40;	// 40:padding左右总和, 2:左右边线总和
	// 当前影院指示块 在页面文档中的X、Y坐标(50:指示块高度)
	var curObjX = obj.offsetLeft, curObjY = obj.offsetTop + 50;
	var pannle_box_html_start = "<div class='pannle-box' style='left:" + curObjX + "px; top: " + curObjY + "px; width:" + pannel_box + "px;'>",
	pannle_box_html_end = "</div>",
	pannle_box_html_searth = "<div class='pannle-search-box'><input type='text' name='pannleSearch' id='pannle_search' class='pannle-search' value='' placeholder='输入影院名字搜索' onclick='handleClickPannleInput(this, event);' onkeyup='filterCinemaByInput(this.value);' /></div>",
	pannle_cnt_html_start = "<div class='pannle-cnt'>",
	pannle_cnt_html_end = "</div>",
	pannle_list_html = "",
	pannle_no_data = "<p class='pn-no-data'>暂无数据</p>";

	// 显示/隐藏
	if(controlShowHide % 2 == 0){
		// 获取该稽核账号下影院列表
		server.queryAuditAccounts(function(callback) {
			if(callback != "" && callback != undefined) {
				var datasL = callback.length;

				for (var i = 0; i < datasL; i++) {
					pannle_list_html += "<a href='javascript:;' data='" + callback[i].platformId + "' id='" + callback[i].cinemaId
							+ "' onclick='handleClickCinemaFromPannle(this);'>" + callback[i].cinameName + "</a>";
				}

				$(document.body).append(pannle_box_html_start + pannle_box_html_searth + pannle_cnt_html_start + pannle_list_html + pannle_no_data + pannle_cnt_html_end + pannle_box_html_end);
				$(".pannle-box").show();
			}
		});
	}else {
		$(".pannle-box").hide();
		$(".pannle-box").remove();
		// 移除背景色
		$(obj).removeClass("location-box-bg");
	}
	controlShowHide++;
}

/**
* 点击页面非当前对象的地方，隐藏当前对象
*
* @param e 事件对象
**/
document.body.onclick = function(e) {
	e = e || event;
	var x = e.clientX;	// 点击位置在页面中的 X轴坐标

	if(x != objX && x != undefined && objX != undefined){
		$(".pannle-box").hide();	// 隐藏对象
		$(".pannle-box").remove();	// 删除对象
		// 移除背景色
		$(".location-box").removeClass("location-box-bg");

		controlShowHide = 0;			// 重置控制变量
	}
};

/**
* 点击影院名字
* 
* @param obj 当前对象
**/
function handleClickCinemaFromPannle(obj) {
	// 更新指示块影院名
	$(".cur-locat-cinema-name").text($(obj).text());
	// 更新对象中的 id、name、platFormId 为当前点击影院
	cinemaObj.id = $(obj).attr("id");
	cinemaObj.name = $(obj).text();
	cinemaObj.platFormId = $(obj).attr("data");

	// 跳转到排期展示
	$(".main").html(muObj.loadImg);
	// 执行点击"排期展示"事件
	clickSubMenu($(".nav-menus").find("li:eq(4)").find(".sub-nav").find("a:eq(0)"), 4, 0);
}

/**
* 搜索框点击
*
* @param obj 当前对象
* @param e 事件对象
**/
function handleClickPannleInput(obj, e) {
	e = e || event;
	objX = e.clientX, objY = e.clientY;
}

/**
* 搜索影片
*
* @param objV 当前输入值
**/
function filterCinemaByInput(objV) {	
	var cinemaCnt = $(".pannle-cnt").find("a"), cinemaCntL = cinemaCnt.length, num = 0, cinemaName = "";
	if(cinemaCntL > 0) {
		for (var i = 0; i < cinemaCntL; i++) {
			cinemaName = $(cinemaCnt[i]).text();

			if(cinemaName.indexOf(objV.trim()) == -1)
				$(cinemaCnt[i]).hide();
			else {
				$(cinemaCnt[i]).show();
				num++;
			}
		}

		if(num == 0)
			$(".pn-no-data").show();
		else
			$(".pn-no-data").hide();
	}
}

/*
* 点击"返回", 隐藏当前影院指示块
*/
function hideCinemaPannle() {
	$(".location-box").hide();
}
