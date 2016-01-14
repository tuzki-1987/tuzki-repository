/*
 * 主框架文件
 */


/**
* 鼠标经过菜单
*
* @param obj 当前对象
**/
function overMenu(obj) {
	$(obj).addClass("li-nav-a-cur");
	var status = $(obj).attr("data");
	var actObj = $(obj).hasClass("li-nav-a-active");	// 检查是否是当前访问项
	var curIndex = $(obj).parent(".li-nav").index();
	var imgV = $(obj).find("img").attr("src");
	var imgPath = imgV.substring(0, imgV.lastIndexOf("/") + 1);
	var imgSuffix = imgV.substring(imgV.indexOf("."), imgV.length);
	var tempImg = imgV.substring(imgV.lastIndexOf("/") + 1, imgV.indexOf("."));
	var actImg = tempImg + "-" + (curIndex+1);
	if(!actObj) {
		$(obj).find("img").attr("src", imgPath + actImg + imgSuffix);
	}
}

/**
* 鼠标离开菜单
*
* @param obj 当前对象
**/
function leaveMenu(obj) {
	var status = $(obj).attr("data");
	$(".li-nav-a").removeClass("li-nav-a-cur");
	var curIndex = $(obj).parent(".li-nav").index();
	var actObj = $(obj).hasClass("li-nav-a-active");	// 检查是否是当前访问项
	if(!actObj) {
		$(obj).find("img").attr("src", "images/icon" + (curIndex+1) + ".png");
	}
}

/**
* 一级菜单点击事件
**/
function firstMenuEvent(obj) {
	// 首先判断登录状态
	// loginStatus();

	var curIndex = $(obj).parent(".li-nav").index();
	$(".li-nav-a").removeClass("li-nav-a-active");
	$(".sub-nav-a").removeClass("sub-nav-a-active");
	resetBgImg();
	overMenu(obj);
	$(obj).addClass("li-nav-a-active");
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
		// leaveMenu(obj);
		// overMenu(obj);
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

	$(".li-nav-a").removeClass("li-nav-a-active");
	$(".sub-nav-a").removeClass("sub-nav-a-active");

	resetBgImg();

	var pobj = $(obj).parent().prev();
	$(obj).addClass("sub-nav-a-active");
	overMenu(pobj);
	$(pobj).addClass("li-nav-a-active");
	loadPage(firstLevel, subLevel);
}

/**
* 遍历取消背景
**/
function resetBgImg() {
	var objDatas = $(".li-nav-a"), objDatasL = objDatas.length;
	for(var i = 0; i < objDatasL; i++) {
		var objs = $(objDatas[i]);
		leaveMenu(objs);
	}
}

/**
* 初始化设置事项(首次访问)
**/
function initSetMenu() {
	var obj = $(".li-nav:eq(0)").find("a");
	overMenu(obj);
	$(".li-nav:eq(0)").find("a").addClass("li-nav-a-active");
	loadPage(0, null);
	loginMainHandler._commontUserInfo();
	// 返回顶部
	returnTop();
}